/**
 * Supermemory Plugin
 *
 * Gives Cline persistent, cross-session memory backed by Supermemory
 * (https://supermemory.ai). Ported from the OpenCode Supermemory plugin and
 * adapted to Cline's plugin primitives.
 *
 * What it does:
 *   - Registers a `supermemory` tool the agent can call to add / search / list /
 *     forget memories and read the user profile.
 *   - On the first turn of a session, recalls the user profile and recent
 *     project memories and injects them into the model request (via a message
 *     builder).
 *   - When the user says something like "remember that ...", nudges the agent to
 *     save it with the `supermemory` tool.
 *
 * CLI usage:
 *   cline plugin install supermemory
 *   SUPERMEMORY_API_KEY=... cline "remember that we run lint before every commit"
 *
 * Configuration:
 *   SUPERMEMORY_API_KEY   Required. Enables the plugin. A model provider key is
 *                         still needed for CLI inference.
 *   SUPERMEMORY_API_URL   Optional base URL override.
 *   SUPERMEMORY_DEBUG     Optional. When set, writes a debug log to
 *                         ~/.cline-supermemory.log.
 *   An optional config file at
 *   <CLINE_DATA_DIR>/plugins/supermemory/config.json(c) can override defaults.
 */

import { type AgentPlugin, createTool, type Message } from "@cline/core"
import { execSync } from "node:child_process"
import { createHash } from "node:crypto"
import { appendFileSync, existsSync, readFileSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"
import Supermemory from "supermemory"

// =============================================================================
// Types
// =============================================================================

type MemoryScope = "user" | "project"

type MemoryType =
	| "project-config"
	| "architecture"
	| "error-solution"
	| "preference"
	| "learned-pattern"
	| "conversation"

interface ProfileLike {
	profile?: {
		static?: unknown[]
		dynamic?: unknown[]
	} | null
}

interface MemoryResultMinimal {
	id?: string
	similarity?: number
	memory?: string
	chunk?: string
}

interface MemoriesResponseMinimal {
	results?: MemoryResultMinimal[]
}

interface ListedMemory {
	id?: string
	summary?: string | null
	content?: string
	title?: string | null
	createdAt?: string
	metadata?: unknown
}

// =============================================================================
// Logger (opt-in via SUPERMEMORY_DEBUG)
// =============================================================================

const LOG_FILE = join(homedir(), ".cline-supermemory.log")
const DEBUG = Boolean(process.env.SUPERMEMORY_DEBUG)

function log(message: string, data?: unknown): void {
	if (!DEBUG) {
		return
	}
	try {
		const timestamp = new Date().toISOString()
		const line = data
			? `[${timestamp}] ${message}: ${JSON.stringify(data)}\n`
			: `[${timestamp}] ${message}\n`
		appendFileSync(LOG_FILE, line)
	} catch {
		// best effort; never throw from logging
	}
}

// =============================================================================
// JSONC helper (strips comments and trailing commas)
// =============================================================================

function stripJsoncComments(content: string): string {
	let result = ""
	let i = 0
	let inString = false
	let inSingleLineComment = false
	let inMultiLineComment = false

	while (i < content.length) {
		const char = content[i]
		const nextChar = content[i + 1]

		if (!inSingleLineComment && !inMultiLineComment && char === '"') {
			let backslashCount = 0
			let j = i - 1
			while (j >= 0 && content[j] === "\\") {
				backslashCount++
				j--
			}
			if (backslashCount % 2 === 0) {
				inString = !inString
			}
			result += char
			i++
			continue
		}

		if (inString) {
			result += char
			i++
			continue
		}

		if (!inSingleLineComment && !inMultiLineComment) {
			if (char === "/" && nextChar === "/") {
				inSingleLineComment = true
				i += 2
				continue
			}
			if (char === "/" && nextChar === "*") {
				inMultiLineComment = true
				i += 2
				continue
			}
		}

		if (inSingleLineComment) {
			if (char === "\n") {
				inSingleLineComment = false
				result += char
			}
			i++
			continue
		}

		if (inMultiLineComment) {
			if (char === "*" && nextChar === "/") {
				inMultiLineComment = false
				i += 2
				continue
			}
			if (char === "\n") {
				result += char
			}
			i++
			continue
		}

		result += char
		i++
	}

	return result.replace(/,\s*([}\]])/g, "$1")
}

// =============================================================================
// Config
// =============================================================================

const CLINE_DATA_DIR =
	process.env.CLINE_DATA_DIR || join(homedir(), ".cline", "data")
const CONFIG_DIR = join(CLINE_DATA_DIR, "plugins", "supermemory")
const CONFIG_FILES = [
	join(CONFIG_DIR, "config.jsonc"),
	join(CONFIG_DIR, "config.json"),
]
const DEFAULT_BASE_URL = "https://api.supermemory.ai"

interface SupermemoryConfig {
	apiKey?: string
	baseUrl?: string
	similarityThreshold?: number
	maxMemories?: number
	maxProjectMemories?: number
	maxProfileItems?: number
	injectProfile?: boolean
	containerTagPrefix?: string
	userContainerTag?: string
	projectContainerTag?: string
	filterPrompt?: string
	keywordPatterns?: string[]
	deepRecall?: boolean
}

const DEFAULT_KEYWORD_PATTERNS = [
	"remember",
	"memorize",
	"save\\s+this",
	"note\\s+this",
	"keep\\s+in\\s+mind",
	"don'?t\\s+forget",
	"learn\\s+this",
	"store\\s+this",
	"record\\s+this",
	"make\\s+a\\s+note",
	"take\\s+note",
	"jot\\s+down",
	"commit\\s+to\\s+memory",
	"remember\\s+that",
	"never\\s+forget",
	"always\\s+remember",
]

const DEFAULTS = {
	similarityThreshold: 0.6,
	maxMemories: 5,
	maxProjectMemories: 10,
	maxProfileItems: 5,
	injectProfile: true,
	containerTagPrefix: "cline",
	filterPrompt:
		"You are a stateful coding agent. Remember all the information, including but not limited to the user's coding preferences, tech stack, behaviours, workflows, and any other relevant details.",
	deepRecall: false,
}

function isValidRegex(pattern: string): boolean {
	try {
		new RegExp(pattern)
		return true
	} catch {
		return false
	}
}

function loadRawConfig(): SupermemoryConfig {
	for (const path of CONFIG_FILES) {
		if (existsSync(path)) {
			try {
				const content = readFileSync(path, "utf-8")
				return JSON.parse(stripJsoncComments(content)) as SupermemoryConfig
			} catch {
				return {}
			}
		}
	}
	return {}
}

const fileConfig = loadRawConfig()

function getApiKey(): string | undefined {
	return process.env.SUPERMEMORY_API_KEY || fileConfig.apiKey || undefined
}

const SUPERMEMORY_API_KEY = getApiKey()

function normalizeBaseUrl(baseUrl: unknown): string | null {
	if (typeof baseUrl !== "string" || !baseUrl.trim()) {
		return null
	}
	try {
		const url = new URL(baseUrl.trim())
		if (url.protocol !== "http:" && url.protocol !== "https:") {
			return null
		}
		url.pathname = url.pathname.replace(/\/+$/, "")
		url.search = ""
		url.hash = ""
		return url.toString().replace(/\/$/, "")
	} catch {
		return null
	}
}

function getApiBaseUrl(): string {
	const configured =
		process.env.SUPERMEMORY_API_URL ||
		process.env.SUPERMEMORY_BASE_URL ||
		fileConfig.baseUrl ||
		DEFAULT_BASE_URL
	return normalizeBaseUrl(configured) ?? DEFAULT_BASE_URL
}

const CONFIG = {
	similarityThreshold:
		fileConfig.similarityThreshold ?? DEFAULTS.similarityThreshold,
	maxMemories: fileConfig.maxMemories ?? DEFAULTS.maxMemories,
	maxProjectMemories:
		fileConfig.maxProjectMemories ?? DEFAULTS.maxProjectMemories,
	maxProfileItems: fileConfig.maxProfileItems ?? DEFAULTS.maxProfileItems,
	injectProfile: fileConfig.injectProfile ?? DEFAULTS.injectProfile,
	containerTagPrefix:
		fileConfig.containerTagPrefix ?? DEFAULTS.containerTagPrefix,
	userContainerTag: fileConfig.userContainerTag,
	projectContainerTag: fileConfig.projectContainerTag,
	filterPrompt: fileConfig.filterPrompt ?? DEFAULTS.filterPrompt,
	keywordPatterns: [
		...DEFAULT_KEYWORD_PATTERNS,
		...(fileConfig.keywordPatterns ?? []).filter(isValidRegex),
	],
	deepRecall: fileConfig.deepRecall ?? DEFAULTS.deepRecall,
}

function isConfigured(): boolean {
	return Boolean(SUPERMEMORY_API_KEY)
}

// =============================================================================
// Container tags (user + project scoping)
// =============================================================================

function sha256(input: string): string {
	return createHash("sha256").update(input).digest("hex").slice(0, 16)
}

function getGitEmail(directory: string): string | null {
	try {
		const email = execSync("git config user.email", {
			encoding: "utf-8",
			cwd: directory,
		}).trim()
		return email || null
	} catch {
		return null
	}
}

function getUserTag(directory: string): string {
	if (CONFIG.userContainerTag) {
		return CONFIG.userContainerTag
	}
	const email = getGitEmail(directory)
	if (email) {
		return `${CONFIG.containerTagPrefix}_user_${sha256(email)}`
	}
	const fallback = process.env.USER || process.env.USERNAME || "anonymous"
	return `${CONFIG.containerTagPrefix}_user_${sha256(fallback)}`
}

function getProjectTag(directory: string): string {
	if (CONFIG.projectContainerTag) {
		return CONFIG.projectContainerTag
	}
	return `${CONFIG.containerTagPrefix}_project_${sha256(directory)}`
}

function getTags(directory: string): { user: string; project: string } {
	return {
		user: getUserTag(directory),
		project: getProjectTag(directory),
	}
}

// =============================================================================
// Privacy (redact <private>...</private> regions before storing)
// =============================================================================

function stripPrivateContent(content: string): string {
	return content.replace(/<private>[\s\S]*?<\/private>/gi, "[REDACTED]")
}

function isFullyPrivate(content: string): boolean {
	const stripped = stripPrivateContent(content).trim()
	return stripped === "[REDACTED]" || stripped === ""
}

// =============================================================================
// Supermemory client
// =============================================================================

const TIMEOUT_MS = 30_000

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
	return Promise.race([
		promise,
		new Promise<T>((_, reject) =>
			setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms),
		),
	])
}

class SupermemoryClient {
	private client: Supermemory | null = null

	private getClient(): Supermemory {
		if (!this.client) {
			if (!isConfigured()) {
				throw new Error("SUPERMEMORY_API_KEY not set")
			}
			// `x-sm-source` lets Supermemory attribute reads and writes to the
			// Cline plugin in their analytics.
			this.client = new Supermemory({
				apiKey: SUPERMEMORY_API_KEY,
				baseURL: getApiBaseUrl(),
				defaultHeaders: { "x-sm-source": "cline" },
			})
			// Best effort; never let a settings failure become an unhandled rejection.
			void this.client.settings
				.update({
					shouldLLMFilter: true,
					filterPrompt: CONFIG.filterPrompt,
				})
				.catch(() => {})
		}
		return this.client
	}

	async searchMemories(query: string, containerTag: string) {
		log("searchMemories: start", { containerTag })
		try {
			const result = await withTimeout(
				this.getClient().search.memories({
					q: query,
					containerTag,
					threshold: CONFIG.similarityThreshold,
					limit: CONFIG.maxMemories,
					searchMode: "hybrid",
				}),
				TIMEOUT_MS,
			)
			return { success: true as const, ...result }
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error)
			log("searchMemories: error", { error: message })
			return {
				success: false as const,
				error: message,
				results: [],
				total: 0,
				timing: 0,
			}
		}
	}

	async getProfile(containerTag: string, query?: string) {
		log("getProfile: start", { containerTag })
		try {
			const result = await withTimeout(
				this.getClient().profile({ containerTag, q: query }),
				TIMEOUT_MS,
			)
			return { success: true as const, ...result }
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error)
			log("getProfile: error", { error: message })
			return { success: false as const, error: message, profile: null }
		}
	}

	async addMemory(
		content: string,
		containerTag: string,
		metadata?: { type?: MemoryType; [key: string]: unknown },
	) {
		log("addMemory: start", { containerTag, contentLength: content.length })
		try {
			const mergedMetadata = {
				sm_source: "cline",
				sm_capture_mode: "tool",
				...(metadata ?? {}),
			} as unknown as Record<string, string | number | boolean | string[]>

			const result = await withTimeout(
				this.getClient().memories.add({
					content,
					containerTag,
					metadata: mergedMetadata,
				}),
				TIMEOUT_MS,
			)
			return { success: true as const, ...result }
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error)
			log("addMemory: error", { error: message })
			return { success: false as const, error: message }
		}
	}

	async deleteMemory(memoryId: string) {
		log("deleteMemory: start", { memoryId })
		try {
			await withTimeout(this.getClient().memories.delete(memoryId), TIMEOUT_MS)
			return { success: true as const }
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error)
			log("deleteMemory: error", { error: message })
			return { success: false as const, error: message }
		}
	}

	async listMemories(containerTag: string, limit = 20) {
		log("listMemories: start", { containerTag, limit })
		try {
			const result = await withTimeout(
				this.getClient().memories.list({
					containerTags: [containerTag],
					limit,
					order: "desc",
					sort: "createdAt",
					includeContent: true,
				}),
				TIMEOUT_MS,
			)
			return { success: true as const, ...result }
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error)
			log("listMemories: error", { error: message })
			return { success: false as const, error: message, memories: [] }
		}
	}
}

const supermemoryClient = new SupermemoryClient()

// =============================================================================
// Context formatting (recall injection)
// =============================================================================

function extractFactText(fact: unknown): string {
	if (typeof fact === "string") {
		return fact
	}
	if (fact != null && typeof fact === "object") {
		const content = (fact as { content?: string }).content
		if (typeof content === "string") {
			return content
		}
		return JSON.stringify(fact)
	}
	return String(fact ?? "")
}

function formatContextForPrompt(
	profile: ProfileLike | null,
	userMemories: MemoriesResponseMinimal,
	projectMemories: MemoriesResponseMinimal,
): string {
	const parts: string[] = ["[SUPERMEMORY]"]

	if (CONFIG.injectProfile && profile?.profile) {
		const staticFacts = profile.profile.static ?? []
		const dynamicFacts = profile.profile.dynamic ?? []

		if (staticFacts.length > 0) {
			parts.push("\nUser Profile:")
			staticFacts.slice(0, CONFIG.maxProfileItems).forEach((fact) => {
				parts.push(`- ${extractFactText(fact)}`)
			})
		}

		if (dynamicFacts.length > 0) {
			parts.push("\nRecent Context:")
			dynamicFacts.slice(0, CONFIG.maxProfileItems).forEach((fact) => {
				parts.push(`- ${extractFactText(fact)}`)
			})
		}
	}

	const projectResults = projectMemories.results ?? []
	if (projectResults.length > 0) {
		parts.push("\nProject Knowledge:")
		projectResults.forEach((mem) => {
			const similarity = Math.round((mem.similarity ?? 0) * 100)
			parts.push(`- [${similarity}%] ${mem.memory || mem.chunk || ""}`)
		})
	}

	const userResults = userMemories.results ?? []
	if (userResults.length > 0) {
		parts.push("\nRelevant Memories:")
		userResults.forEach((mem) => {
			const similarity = Math.round((mem.similarity ?? 0) * 100)
			parts.push(`- [${similarity}%] ${mem.memory || mem.chunk || ""}`)
		})
	}

	if (parts.length === 1) {
		return ""
	}

	return parts.join("\n")
}

async function buildRecallContext(
	query: string,
	tags: { user: string; project: string },
): Promise<string> {
	// Always surface the user profile and recent project memories. Deep recall
	// additionally searches user-scoped memories keyed on the current prompt.
	const [profileResult, projectListResult, userMemoriesResult] =
		await Promise.all([
			supermemoryClient.getProfile(tags.user, CONFIG.deepRecall ? query : undefined),
			supermemoryClient.listMemories(tags.project, CONFIG.maxProjectMemories),
			CONFIG.deepRecall
				? supermemoryClient.searchMemories(query, tags.user)
				: Promise.resolve({ success: false as const, results: [] }),
		])

	const profile = profileResult.success ? profileResult : null
	const projectList = projectListResult.success
		? projectListResult
		: { memories: [] }
	const userMemories: MemoriesResponseMinimal = userMemoriesResult.success
		? userMemoriesResult
		: { results: [] }

	const projectMemories: MemoriesResponseMinimal = {
		results: ((projectList.memories ?? []) as unknown as ListedMemory[]).map(
			(m) => ({
				id: m.id,
				memory: m.summary || m.content || m.title || "",
				similarity: 1,
			}),
		),
	}

	return formatContextForPrompt(profile, userMemories, projectMemories)
}

// =============================================================================
// Memory keyword detection + nudge
// =============================================================================

const CODE_BLOCK_PATTERN = /```[\s\S]*?```/g
const INLINE_CODE_PATTERN = /`[^`]+`/g
const MEMORY_KEYWORD_PATTERN = new RegExp(
	`\\b(${CONFIG.keywordPatterns.join("|")})\\b`,
	"i",
)

const MEMORY_NUDGE_MESSAGE = `[SUPERMEMORY]
The user's latest message may be asking you to remember something. If they are explicitly asking you to save or remember information for later, use the \`supermemory\` tool with \`mode: "add"\` to store it as a concise, searchable memory:
- \`scope: "project"\` for workspace-specific facts (e.g., "run lint with tests")
- \`scope: "user"\` for cross-project preferences (e.g., "prefers concise responses")
- pick an appropriate \`type\` (preference, project-config, learned-pattern, etc.)

If the message only mentions remembering in passing and is not a request to save anything, ignore this note.`

function removeCodeBlocks(text: string): string {
	return text.replace(CODE_BLOCK_PATTERN, "").replace(INLINE_CODE_PATTERN, "")
}

function detectMemoryKeyword(text: string): boolean {
	return MEMORY_KEYWORD_PATTERN.test(removeCodeBlocks(text))
}

// =============================================================================
// Message helpers
// =============================================================================

function getMessageText(message: Message): string {
	if (typeof message.content === "string") {
		return message.content
	}
	if (!Array.isArray(message.content)) {
		return ""
	}
	return message.content
		.filter((block) => block.type === "text")
		.map((block) => (block as { text?: string }).text ?? "")
		.join("\n")
}

// =============================================================================
// Tool: supermemory
// =============================================================================

function clampLimit(limit: number | undefined, fallback: number, max = 50): number {
	if (typeof limit !== "number" || !Number.isFinite(limit)) {
		return fallback
	}
	return Math.min(Math.max(Math.trunc(limit), 1), max)
}

function formatSearchResults(
	query: string,
	scope: string | undefined,
	results: { results?: MemoryResultMinimal[] },
	limit?: number,
): string {
	const memoryResults = results.results ?? []
	return JSON.stringify({
		success: true,
		query,
		scope,
		count: memoryResults.length,
		results: memoryResults.slice(0, clampLimit(limit, 10)).map((r) => ({
			id: r.id,
			content: r.memory || r.chunk,
			similarity: Math.round((r.similarity ?? 0) * 100),
		})),
	})
}

interface SupermemoryToolArgs {
	mode?: string
	content?: string
	query?: string
	type?: MemoryType
	scope?: MemoryScope
	memoryId?: string
	limit?: number
}

async function executeSupermemoryTool(
	args: SupermemoryToolArgs,
	tags: { user: string; project: string },
): Promise<string> {
	if (!isConfigured()) {
		return JSON.stringify({
			success: false,
			error: "SUPERMEMORY_API_KEY not set. Set it in your environment to use Supermemory.",
		})
	}

	const mode = args.mode || "help"

	try {
		switch (mode) {
			case "help": {
				return JSON.stringify({
					success: true,
					message: "Supermemory Usage Guide",
					commands: [
						{ command: "add", description: "Store a new memory", args: ["content", "type?", "scope?"] },
						{ command: "search", description: "Search memories", args: ["query", "scope?"] },
						{ command: "profile", description: "View user profile", args: ["query?"] },
						{ command: "list", description: "List recent memories", args: ["scope?", "limit?"] },
						{ command: "forget", description: "Remove a memory", args: ["memoryId"] },
					],
					scopes: {
						user: "Cross-project preferences and knowledge",
						project: "Project-specific knowledge (default)",
					},
					types: [
						"project-config",
						"architecture",
						"error-solution",
						"preference",
						"learned-pattern",
						"conversation",
					],
				})
			}

			case "add": {
				if (!args.content) {
					return JSON.stringify({ success: false, error: "content parameter is required for add mode" })
				}
				const sanitizedContent = stripPrivateContent(args.content)
				if (isFullyPrivate(args.content)) {
					return JSON.stringify({ success: false, error: "Cannot store fully private content" })
				}
				const scope = args.scope || "project"
				const containerTag = scope === "user" ? tags.user : tags.project
				const result = await supermemoryClient.addMemory(sanitizedContent, containerTag, {
					type: args.type,
				})
				if (!result.success) {
					return JSON.stringify({ success: false, error: result.error || "Failed to add memory" })
				}
				return JSON.stringify({
					success: true,
					message: `Memory added to ${scope} scope`,
					id: result.id,
					scope,
					type: args.type,
				})
			}

			case "search": {
				if (!args.query) {
					return JSON.stringify({ success: false, error: "query parameter is required for search mode" })
				}
				const scope = args.scope
				if (scope === "user" || scope === "project") {
					const containerTag = scope === "user" ? tags.user : tags.project
					const result = await supermemoryClient.searchMemories(args.query, containerTag)
					if (!result.success) {
						return JSON.stringify({ success: false, error: result.error || "Failed to search memories" })
					}
					return formatSearchResults(args.query, scope, result, args.limit)
				}

				const [userResult, projectResult] = await Promise.all([
					supermemoryClient.searchMemories(args.query, tags.user),
					supermemoryClient.searchMemories(args.query, tags.project),
				])
				if (!userResult.success || !projectResult.success) {
					return JSON.stringify({
						success: false,
						error:
							(!userResult.success && userResult.error) ||
							(!projectResult.success && projectResult.error) ||
							"Failed to search memories",
					})
				}
				const combined = [
					...(userResult.results ?? []).map((r) => ({ ...r, scope: "user" as const })),
					...(projectResult.results ?? []).map((r) => ({ ...r, scope: "project" as const })),
				].sort((a, b) => (b.similarity ?? 0) - (a.similarity ?? 0))
				return JSON.stringify({
					success: true,
					query: args.query,
					count: combined.length,
					results: combined.slice(0, clampLimit(args.limit, 10)).map((r) => ({
						id: r.id,
						content: r.memory || r.chunk,
						similarity: Math.round((r.similarity ?? 0) * 100),
						scope: r.scope,
					})),
				})
			}

			case "profile": {
				const result = await supermemoryClient.getProfile(tags.user, args.query)
				if (!result.success) {
					return JSON.stringify({ success: false, error: result.error || "Failed to fetch profile" })
				}
				const profile = (result as { profile?: { static?: unknown[]; dynamic?: unknown[] } }).profile
				return JSON.stringify({
					success: true,
					profile: {
						static: profile?.static ?? [],
						dynamic: profile?.dynamic ?? [],
					},
				})
			}

			case "list": {
				const scope = args.scope || "project"
				const limit = clampLimit(args.limit, 20)
				const containerTag = scope === "user" ? tags.user : tags.project
				const result = await supermemoryClient.listMemories(containerTag, limit)
				if (!result.success) {
					return JSON.stringify({ success: false, error: result.error || "Failed to list memories" })
				}
				const memories = (result.memories ?? []) as unknown as ListedMemory[]
				return JSON.stringify({
					success: true,
					scope,
					count: memories.length,
					memories: memories.map((m) => ({
						id: m.id,
						content: m.summary || m.content || m.title || "",
						createdAt: m.createdAt,
						metadata: m.metadata,
					})),
				})
			}

			case "forget": {
				if (!args.memoryId) {
					return JSON.stringify({ success: false, error: "memoryId parameter is required for forget mode" })
				}
				// Deletion is by global memory id; scope is not used to target the delete.
				const result = await supermemoryClient.deleteMemory(args.memoryId)
				if (!result.success) {
					return JSON.stringify({ success: false, error: result.error || "Failed to delete memory" })
				}
				return JSON.stringify({
					success: true,
					message: `Memory ${args.memoryId} forgotten`,
				})
			}

			default:
				return JSON.stringify({ success: false, error: `Unknown mode: ${mode}` })
		}
	} catch (error) {
		return JSON.stringify({
			success: false,
			error: error instanceof Error ? error.message : String(error),
		})
	}
}

// =============================================================================
// Plugin
// =============================================================================

const plugin: AgentPlugin = {
	name: "supermemory",
	manifest: {
		capabilities: ["tools", "messageBuilders"],
	},

	setup(api, ctx) {
		const directory = ctx.workspaceInfo?.rootPath || process.cwd()
		const tags = getTags(directory)
		log("Plugin setup", { directory, tags, configured: isConfigured() })

		api.registerTool(
			createTool({
				name: "supermemory",
				description:
					"Manage and query the Supermemory persistent memory system. Use 'search' to find relevant memories, 'add' to store new knowledge, 'profile' to view the user profile, 'list' to see recent memories, 'forget' to remove a memory.",
				inputSchema: {
					type: "object",
					properties: {
						mode: {
							type: "string",
							enum: ["add", "search", "profile", "list", "forget", "help"],
							description: "The operation to perform. Defaults to 'help'.",
						},
						content: {
							type: "string",
							description: "The memory text to store (used by 'add').",
						},
						query: {
							type: "string",
							description: "Search query (used by 'search' and optionally 'profile').",
						},
						type: {
							type: "string",
							enum: [
								"project-config",
								"architecture",
								"error-solution",
								"preference",
								"learned-pattern",
								"conversation",
							],
							description: "Category of the memory (used by 'add').",
						},
						scope: {
							type: "string",
							enum: ["user", "project"],
							description:
								"Memory scope. 'project' is workspace-specific (default); 'user' is shared across projects.",
						},
						memoryId: {
							type: "string",
							description: "ID of the memory to remove (used by 'forget').",
						},
						limit: {
							type: "number",
							description: "Maximum number of results to return.",
						},
					},
					additionalProperties: false,
				},
				timeoutMs: 30_000,
				retryable: false,
				execute: async (input: unknown) =>
					executeSupermemoryTool((input ?? {}) as SupermemoryToolArgs, tags),
			}),
		)

		if (!isConfigured()) {
			log("Plugin disabled - SUPERMEMORY_API_KEY not set; recall builder skipped")
			return
		}

		api.registerMessageBuilder({
			name: "supermemory-recall",
			async build(messages: Message[]): Promise<Message[]> {
				try {
					const last = messages[messages.length - 1]
					if (!last || last.role !== "user") {
						return messages
					}
					const userText = getMessageText(last)
					if (!userText.trim()) {
						// Likely a tool-result carrier message; nothing to act on.
						return messages
					}

					let next = messages

					// Recall: only on the first turn (no assistant message yet).
					const hasAssistant = messages.some((m) => m.role === "assistant")
					if (!hasAssistant) {
						const recall = await buildRecallContext(userText, tags)
						if (recall.trim()) {
							next = [{ role: "user", content: recall }, ...next]
							log("recall injected", { length: recall.length })
						}
					}

					// Nudge: whenever the latest user message asks to remember something.
					if (detectMemoryKeyword(userText)) {
						next = [...next, { role: "user", content: MEMORY_NUDGE_MESSAGE }]
						log("memory nudge appended")
					}

					return next
				} catch (error) {
					log("build: error", { error: String(error) })
					return messages
				}
			},
		})
	},
}

export { plugin }
export default plugin
