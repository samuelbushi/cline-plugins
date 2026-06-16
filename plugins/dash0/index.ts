import { createHash, randomBytes } from "node:crypto"
import { readFileSync } from "node:fs"
import type { AgentPlugin, AgentRunResult } from "@cline/sdk"

type AttributeValue =
	| { stringValue: string }
	| { intValue: string }
	| { boolValue: boolean }

type Attribute = {
	key: string
	value: AttributeValue
}

type SpanStatus = {
	code: number
	message?: string
}

type Span = {
	traceId: string
	spanId: string
	parentSpanId?: string
	name: string
	kind: number
	startTimeUnixNano: string
	endTimeUnixNano: string
	attributes: Attribute[]
	status: SpanStatus
}

type Dash0Config = {
	otlpUrl: string
	authToken: string
	dataset: string
	serviceName: string
	teamName: string
	omitIO: boolean
	omitUserInfo: boolean
	includeWorkspace: boolean
	debug: boolean
}

type RunRecord = {
	traceId: string
	spanId: string
	startedAt: Date
}

const PLUGIN_NAME = "dash0"
const VERSION = "0.0.0"
const SPAN_KIND_INTERNAL = 1
const STATUS_UNSET = 0
const STATUS_ERROR = 2
const MAX_FIELD_LENGTH = 16_000

const runsByConversation = new Map<string, RunRecord>()
let cachedAuthToken: string | undefined

function env(key: string): string {
	return process.env[key]?.trim() ?? ""
}

function boolEnv(key: string, defaultValue: boolean): boolean {
	const value = env(key).toLowerCase()
	if (!value) return defaultValue
	return value === "1" || value === "true" || value === "yes"
}

function config(): Dash0Config {
	return {
		otlpUrl: env("DASH0_OTLP_URL").replace(/\/+$/, ""),
		authToken: authToken(),
		dataset: env("DASH0_DATASET"),
		serviceName: env("DASH0_AGENT_NAME") || "cline",
		teamName: env("DASH0_TEAM_NAME"),
		omitIO: boolEnv("DASH0_OMIT_IO", true),
		omitUserInfo: boolEnv("DASH0_OMIT_USER_INFO", true),
		includeWorkspace: boolEnv("DASH0_INCLUDE_WORKSPACE", false),
		debug: boolEnv("DASH0_DEBUG", false),
	}
}

function authToken(): string {
	if (cachedAuthToken !== undefined) return cachedAuthToken
	const tokenFile = env("DASH0_AUTH_TOKEN_FILE")
	if (tokenFile) {
		try {
			cachedAuthToken = readFileSync(tokenFile, "utf8").trim()
		} catch {
			cachedAuthToken = ""
		}
		delete process.env.DASH0_AUTH_TOKEN_FILE
		delete process.env.DASH0_AUTH_TOKEN
		return cachedAuthToken
	}
	cachedAuthToken = env("DASH0_AUTH_TOKEN")
	delete process.env.DASH0_AUTH_TOKEN
	return cachedAuthToken
}

function randomHex(bytes: number): string {
	return randomBytes(bytes).toString("hex")
}

function stableTraceId(value: string): string {
	return createHash("sha256").update(value).digest("hex").slice(0, 32)
}

function unixNano(date: Date): string {
	return String(BigInt(date.getTime()) * 1_000_000n)
}

function stringAttr(key: string, value: unknown): Attribute | undefined {
	if (value === undefined || value === null || value === "") return undefined
	return {
		key,
		value: { stringValue: String(value).slice(0, MAX_FIELD_LENGTH) },
	}
}

function intAttr(key: string, value: unknown): Attribute | undefined {
	if (typeof value !== "number" || !Number.isFinite(value)) return undefined
	return { key, value: { intValue: String(Math.trunc(value)) } }
}

function boolAttr(key: string, value: unknown): Attribute | undefined {
	if (typeof value !== "boolean") return undefined
	return { key, value: { boolValue: value } }
}

function compactJson(value: unknown): string {
	try {
		return JSON.stringify(value)?.slice(0, MAX_FIELD_LENGTH) ?? ""
	} catch {
		return "[unserializable]"
	}
}

function attrList(
	values: Array<Attribute | undefined | false>,
): Attribute[] {
	return values.filter(Boolean) as Attribute[]
}

function workspaceAttrs(
	snapshot: Record<string, unknown>,
	cfg: Dash0Config,
): Attribute[] {
	const workspace = snapshot.workspaceInfo as
		| {
				rootPath?: string
				latestGitBranchName?: string
				latestGitCommitHash?: string
				associatedRemoteUrls?: string[]
		  }
		| undefined
	const base = attrList([
		stringAttr("cline.agent.id", snapshot.agentId),
		stringAttr(
			"gen_ai.conversation.id",
			snapshot.conversationId ?? snapshot.runId,
		),
	])
	if (!cfg.includeWorkspace) return base
	return [
		...base,
		...attrList([
			stringAttr(
				"dash0.gen_ai.vcs.ref.head.name",
				workspace?.latestGitBranchName,
			),
			stringAttr(
				"dash0.gen_ai.vcs.commit.sha",
				workspace?.latestGitCommitHash,
			),
			stringAttr(
				"dash0.gen_ai.vcs.repository.url.full",
				workspace?.associatedRemoteUrls?.[0],
			),
			stringAttr("cline.workspace.root", workspace?.rootPath),
		]),
	]
}

function userAttrs(cfg: Dash0Config): Attribute[] {
	if (cfg.omitUserInfo) return []
	const raw = env("USER") || env("USERNAME")
	if (!raw) return []
	return attrList([stringAttr("user.name", raw)])
}

function resourceAttributes(cfg: Dash0Config): Attribute[] {
	return attrList([
		stringAttr("service.name", cfg.serviceName),
		stringAttr("service.version", VERSION),
		stringAttr("gen_ai.provider.name", "cline"),
		stringAttr("gen_ai.agent.name", cfg.serviceName),
		stringAttr("dash0.team.name", cfg.teamName),
		...userAttrs(cfg),
	])
}

function otlpPayload(span: Span, cfg: Dash0Config): unknown {
	return {
		resourceSpans: [
			{
				resource: {
					attributes: resourceAttributes(cfg),
				},
				scopeSpans: [
					{
						scope: {
							name: "cline-dash0-plugin",
							version: VERSION,
						},
						spans: [span],
					},
				],
			},
		],
	}
}

async function exportSpan(span: Span): Promise<void> {
	const cfg = config()
	if (!cfg.otlpUrl && !cfg.debug) return

	const payload = JSON.stringify(otlpPayload(span, cfg))
	if (cfg.debug) {
		console.error(`[dash0:trace] ${payload}`)
	}
	if (!cfg.otlpUrl) return

	try {
		const response = await fetch(`${cfg.otlpUrl}/v1/traces`, {
			method: "POST",
			headers: {
				"content-type": "application/json",
				...(cfg.authToken ? { authorization: `Bearer ${cfg.authToken}` } : {}),
				...(cfg.dataset ? { "Dash0-Dataset": cfg.dataset } : {}),
			},
			body: payload,
			signal: AbortSignal.timeout(2000),
		})
		if (!response.ok && cfg.debug) {
			console.error(`[dash0:log] OTLP export failed: ${response.status}`)
		}
	} catch (error) {
		if (cfg.debug) {
			console.error(
				`[dash0:log] OTLP export failed: ${error instanceof Error ? error.message : String(error)}`,
			)
		}
	}
}

function conversationId(snapshot: Record<string, unknown>): string {
	return String(snapshot.conversationId ?? snapshot.runId ?? snapshot.agentId)
}

function runKey(snapshot: Record<string, unknown>): string {
	return conversationId(snapshot)
}

function runStatus(result: AgentRunResult, cfg: Dash0Config): SpanStatus {
	if (result.status === "completed") return { code: STATUS_UNSET }
	return {
		code: STATUS_ERROR,
		message: cfg.omitIO
			? "Cline run failed"
			: (result.error?.message ?? result.status),
	}
}

function resultAttrs(result: AgentRunResult, cfg: Dash0Config): Attribute[] {
	return attrList([
		stringAttr("gen_ai.operation.name", "chat"),
		stringAttr("cline.run.status", result.status),
		intAttr("cline.run.iterations", result.iterations),
		intAttr("gen_ai.usage.input_tokens", result.usage?.inputTokens),
		intAttr("gen_ai.usage.output_tokens", result.usage?.outputTokens),
		intAttr("gen_ai.usage.total_tokens", result.usage?.totalTokens),
		!cfg.omitIO && stringAttr("gen_ai.output", result.outputText),
	])
}

function toolStatus(
	result: { isError?: boolean; output: unknown },
	cfg: Dash0Config,
): SpanStatus {
	if (!result.isError) return { code: STATUS_UNSET }
	return {
		code: STATUS_ERROR,
		message: cfg.omitIO ? "Tool execution failed" : compactJson(result.output),
	}
}

const plugin: AgentPlugin = {
	name: PLUGIN_NAME,
	manifest: { capabilities: ["hooks"] },

	setup() {
		authToken()
	},

	hooks: {
		beforeRun({ snapshot }) {
			const snap = snapshot as unknown as Record<string, unknown>
			const id = conversationId(snap)
			runsByConversation.set(runKey(snap), {
				traceId: stableTraceId(id),
				spanId: randomHex(8),
				startedAt: new Date(),
			})
			return undefined
		},

		async afterRun({ snapshot, result }) {
			const cfg = config()
			const snap = snapshot as unknown as Record<string, unknown>
			const key = runKey(snap)
			const record =
				runsByConversation.get(key) ??
				({
					traceId: stableTraceId(conversationId(snap)),
					spanId: randomHex(8),
					startedAt: new Date(),
				} satisfies RunRecord)
			runsByConversation.delete(key)
			void exportSpan({
				traceId: record.traceId,
				spanId: record.spanId,
				name: "cline.run",
				kind: SPAN_KIND_INTERNAL,
				startTimeUnixNano: unixNano(record.startedAt),
				endTimeUnixNano: unixNano(new Date()),
				attributes: [
					...workspaceAttrs(snap, cfg),
					...resultAttrs(result, cfg),
				],
				status: runStatus(result, cfg),
			})
		},

		async afterTool({
			snapshot,
			toolCall,
			input,
			result,
			startedAt,
			endedAt,
			durationMs,
		}) {
			const cfg = config()
			const snap = snapshot as unknown as Record<string, unknown>
			const parent = runsByConversation.get(runKey(snap))
			void exportSpan({
				traceId: parent?.traceId ?? stableTraceId(conversationId(snap)),
				spanId: randomHex(8),
				parentSpanId: parent?.spanId,
				name: `execute_tool ${toolCall.toolName}`,
				kind: SPAN_KIND_INTERNAL,
				startTimeUnixNano: unixNano(startedAt),
				endTimeUnixNano: unixNano(endedAt),
				attributes: attrList([
					...workspaceAttrs(snap, cfg),
					stringAttr("gen_ai.operation.name", "execute_tool"),
					stringAttr("gen_ai.tool.name", toolCall.toolName),
					stringAttr("gen_ai.tool.call.id", toolCall.toolCallId),
					intAttr("cline.tool.duration_ms", durationMs),
					boolAttr("cline.tool.is_error", result.isError === true),
					!cfg.omitIO && stringAttr("gen_ai.tool.call.arguments", compactJson(input)),
					!cfg.omitIO &&
						stringAttr("gen_ai.tool.call.result", compactJson(result.output)),
				]),
				status: toolStatus(result, cfg),
			})
			return undefined
		},
	},
}

export default plugin
