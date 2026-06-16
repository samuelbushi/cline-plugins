import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { homedir } from "node:os"
import { dirname, join } from "node:path"
import type { AgentPlugin } from "@cline/sdk"

const PLUGIN_NAME = "ralph-loop"
const DEFAULT_MAX_ITERATIONS = 5
const MAX_ALLOWED_ITERATIONS = 50
const CLINE_DATA_DIR =
	process.env.CLINE_DATA_DIR || join(homedir(), ".cline", "data")
const STATE_PATH = join(
	CLINE_DATA_DIR,
	"plugins",
	PLUGIN_NAME,
	"loops.json",
)

interface ClinePluginHost {
	emitEvent?: (name: string, payload?: unknown) => void
}

declare global {
	var __clinePluginHost: ClinePluginHost | undefined
}

type RalphLoop = {
	prompt: string
	iteration: number
	maxIterations: number
	createdAt: string
	sessionId?: string
	completionPromise?: string
}

type RalphState = {
	version: 1
	pendingLoop?: RalphLoop
	activeLoops: Record<string, RalphLoop>
}

type ParsedArgs =
	| { kind: "help" | "status" | "cancel" }
	| {
			kind: "start"
			prompt: string
			maxIterations: number
			completionPromise?: string
	  }
	| { kind: "error"; message: string }

let setupSessionId: string | undefined

function emptyState(): RalphState {
	return {
		version: 1,
		activeLoops: {},
	}
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === "object" && !Array.isArray(value)
}

function asLoop(value: unknown): RalphLoop | undefined {
	if (!isRecord(value) || typeof value.prompt !== "string") {
		return undefined
	}
	const prompt = value.prompt.trim()
	if (!prompt) {
		return undefined
	}
	const iteration =
		typeof value.iteration === "number" && Number.isInteger(value.iteration)
			? value.iteration
			: 1
	const maxIterations =
		typeof value.maxIterations === "number" &&
		Number.isInteger(value.maxIterations)
			? value.maxIterations
			: DEFAULT_MAX_ITERATIONS
	const createdAt =
		typeof value.createdAt === "string" && value.createdAt.trim()
			? value.createdAt
			: new Date().toISOString()
	const sessionId =
		typeof value.sessionId === "string" && value.sessionId.trim()
			? value.sessionId.trim()
			: undefined
	const completionPromise =
		typeof value.completionPromise === "string" &&
		value.completionPromise.trim()
			? value.completionPromise.trim()
			: undefined
	return {
		prompt,
		iteration,
		maxIterations,
		createdAt,
		...(sessionId ? { sessionId } : {}),
		...(completionPromise ? { completionPromise } : {}),
	}
}

function readState(): RalphState {
	if (!existsSync(STATE_PATH)) {
		return emptyState()
	}
	try {
		const parsed: unknown = JSON.parse(readFileSync(STATE_PATH, "utf8"))
		if (!isRecord(parsed)) {
			return emptyState()
		}
		const pendingLoop = asLoop(parsed.pendingLoop)
		const activeLoops: Record<string, RalphLoop> = {}
		if (isRecord(parsed.activeLoops)) {
			for (const [sessionId, value] of Object.entries(parsed.activeLoops)) {
				const loop = asLoop(value)
				if (sessionId.trim() && loop) {
					activeLoops[sessionId] = { ...loop, sessionId }
				}
			}
		}
		return {
			version: 1,
			...(pendingLoop ? { pendingLoop } : {}),
			activeLoops,
		}
	} catch {
		return emptyState()
	}
}

function writeState(state: RalphState): void {
	mkdirSync(dirname(STATE_PATH), { recursive: true })
	writeFileSync(STATE_PATH, `${JSON.stringify(state, null, 2)}\n`, "utf8")
}

function tokenize(input: string): string[] {
	const tokens: string[] = []
	const pattern = /"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'|(\S+)/g
	for (const match of input.matchAll(pattern)) {
		const raw = match[1] ?? match[2] ?? match[3] ?? ""
		tokens.push(raw.replace(/\\(["'\\])/g, "$1"))
	}
	return tokens
}

function parseArgs(input: string): ParsedArgs {
	const tokens = tokenize(input)
	if (tokens.length === 0) {
		return { kind: "help" }
	}
	const command = tokens[0]?.toLowerCase()
	if (
		tokens.length === 1 &&
		(command === "help" || command === "--help" || command === "-h")
	) {
		return { kind: "help" }
	}
	if (tokens.length === 1 && command === "status") {
		return { kind: "status" }
	}
	if (
		tokens.length === 1 &&
		(command === "cancel" ||
			command === "stop" ||
			command === "clear" ||
			command === "off")
	) {
		return { kind: "cancel" }
	}

	const promptParts: string[] = []
	let maxIterations = DEFAULT_MAX_ITERATIONS
	let completionPromise: string | undefined

	for (let i = 0; i < tokens.length; i += 1) {
		const token = tokens[i]
		if (token === "--max-iterations") {
			const raw = tokens[i + 1]
			if (!raw) {
				return {
					kind: "error",
					message: "--max-iterations requires a number.",
				}
			}
			const value = Number(raw)
			if (
				!Number.isInteger(value) ||
				value < 1 ||
				value > MAX_ALLOWED_ITERATIONS
			) {
				return {
					kind: "error",
					message: `--max-iterations must be a number from 1 to ${MAX_ALLOWED_ITERATIONS}.`,
				}
			}
			maxIterations = value
			i += 1
			continue
		}
		if (token === "--completion-promise") {
			const value = tokens[i + 1]?.trim()
			if (!value) {
				return {
					kind: "error",
					message: "--completion-promise requires text.",
				}
			}
			completionPromise = value
			i += 1
			continue
		}
		promptParts.push(token)
	}

	const prompt = promptParts.join(" ").trim()
	if (!prompt) {
		return { kind: "error", message: "Provide a task prompt." }
	}
	return {
		kind: "start",
		prompt,
		maxIterations,
		...(completionPromise ? { completionPromise } : {}),
	}
}

function currentLoop(sessionId: string | undefined): RalphLoop | undefined {
	const state = readState()
	if (sessionId) {
		const active = state.activeLoops[sessionId]
		if (active) {
			return active
		}
	}
	if (state.pendingLoop) {
		return state.pendingLoop
	}
	const active = Object.values(state.activeLoops)
	return active.length === 1 ? active[0] : undefined
}

function saveNewLoop(loop: RalphLoop, sessionId: string | undefined): RalphLoop {
	const state = readState()
	const next = {
		...loop,
		...(sessionId ? { sessionId } : {}),
	}
	if (sessionId) {
		state.activeLoops[sessionId] = next
		delete state.pendingLoop
	} else {
		state.pendingLoop = next
	}
	writeState(state)
	return next
}

function claimPendingLoop(sessionId: string | undefined): void {
	if (!sessionId) {
		return
	}
	const state = readState()
	if (state.activeLoops[sessionId] || !state.pendingLoop) {
		return
	}
	state.activeLoops[sessionId] = {
		...state.pendingLoop,
		sessionId,
	}
	delete state.pendingLoop
	writeState(state)
}

function clearLoop(sessionId: string | undefined): RalphLoop | undefined {
	const state = readState()
	let removed: RalphLoop | undefined
	if (sessionId && state.activeLoops[sessionId]) {
		removed = state.activeLoops[sessionId]
		delete state.activeLoops[sessionId]
	} else if (state.pendingLoop) {
		removed = state.pendingLoop
		delete state.pendingLoop
	} else if (!sessionId) {
		const active = Object.entries(state.activeLoops)
		if (active.length === 1) {
			const [activeSessionId, activeLoop] = active[0]
			removed = activeLoop
			delete state.activeLoops[activeSessionId]
		}
	}
	writeState(state)
	return removed
}

function hasAmbiguousActiveLoops(sessionId: string | undefined): boolean {
	if (sessionId) {
		return false
	}
	const state = readState()
	return !state.pendingLoop && Object.keys(state.activeLoops).length > 1
}

function updateLoop(loop: RalphLoop): void {
	if (!loop.sessionId) {
		return
	}
	const state = readState()
	state.activeLoops[loop.sessionId] = loop
	writeState(state)
}

function emitQueueMessage(sessionId: string | undefined, prompt: string): void {
	if (!sessionId || !prompt.trim()) {
		return
	}
	globalThis.__clinePluginHost?.emitEvent?.("queue_message", {
		sessionId,
		prompt,
	})
}

function normalizePromise(value: string): string {
	return value.trim().replace(/\s+/g, " ")
}

function outputMatchesPromise(output: string, promise: string | undefined): boolean {
	if (!promise) {
		return false
	}
	const lastLine = output
		.trim()
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter(Boolean)
		.at(-1)
	const match = lastLine?.match(/^<promise>([\s\S]*?)<\/promise>$/)
	return (
		!!match &&
		normalizePromise(match[1] ?? "") === normalizePromise(promise)
	)
}

function iterationPrompt(loop: RalphLoop): string {
	const lines = [
		`Ralph loop iteration ${loop.iteration} of ${loop.maxIterations}.`,
		"",
		"Continue the same task. Read the current workspace state, tests, and any files you changed in previous iterations before deciding what to do next.",
		"Do not repeat completed work. If the task is blocked, document the blocker and the best next action.",
	]
	if (loop.completionPromise) {
		lines.push(
			`Only when the task is completely true, end your response with <promise>${loop.completionPromise}</promise>.`,
			"Do not output the promise early just to stop the loop.",
		)
	} else {
		lines.push(
			"No completion promise is configured, so the loop stops only at the iteration limit or when the user cancels it.",
		)
	}
	lines.push("", "Task prompt:", loop.prompt)
	return lines.join("\n")
}

function activeLoopRule(): string {
	const loop = currentLoop(setupSessionId)
	if (!loop) {
		return ""
	}
	const completion = loop.completionPromise
		? `Completion promise: <promise>${loop.completionPromise}</promise>. Output it only when the statement is completely true.`
		: "No completion promise is configured."
	return [
		"Ralph loop is active.",
		`Iteration: ${loop.iteration} of ${loop.maxIterations}.`,
		completion,
		"Treat each queued iteration as continuation of the same task; inspect workspace state and avoid redoing completed work.",
	].join("\n")
}

function formatHelp(): string {
	return [
		"Ralph loop repeatedly queues the same task prompt after each completed Cline run, so Cline can iteratively improve the workspace until a completion promise is reached or the iteration limit stops it.",
		"",
		"Usage:",
		'/ralph-loop "Fix the auth bug and run tests" --max-iterations 5 --completion-promise "FIXED"',
		"/ralph-loop status",
		"/cancel-ralph",
		"",
		`Default max iterations: ${DEFAULT_MAX_ITERATIONS}. Maximum allowed: ${MAX_ALLOWED_ITERATIONS}.`,
		"Always use clear success criteria and prefer a completion promise for tasks with an objective stopping condition.",
	].join("\n")
}

function formatStatus(): string {
	const state = readState()
	const loops = [
		...(state.pendingLoop ? [["pending", state.pendingLoop] as const] : []),
		...Object.entries(state.activeLoops),
	]
	const scoped = setupSessionId
		? loops.filter(([sessionId]) => sessionId === setupSessionId)
		: loops
	if (scoped.length === 0) {
		return "No active Ralph loop."
	}
	const lines = ["Active Ralph loop:"]
	for (const [sessionId, loop] of scoped) {
		const promise = loop.completionPromise
			? `<promise>${loop.completionPromise}</promise>`
			: "none"
		lines.push(
			`- session: ${sessionId}`,
			`  iteration: ${loop.iteration} of ${loop.maxIterations}`,
			`  completion promise: ${promise}`,
			`  prompt: ${loop.prompt}`,
		)
	}
	return lines.join("\n")
}

const plugin: AgentPlugin = {
	name: PLUGIN_NAME,
	manifest: {
		capabilities: ["commands", "hooks", "rules"],
	},

	setup(api, ctx) {
		setupSessionId = ctx.session?.sessionId?.trim() || undefined

		api.registerCommand({
			name: "ralph-loop",
			description:
				"Start or inspect a bounded iterative Ralph loop in the current Cline session.",
			handler: (input) => {
				const parsed = parseArgs(input)
				if (parsed.kind === "help") {
					return formatHelp()
				}
				if (parsed.kind === "status") {
					return formatStatus()
				}
				if (parsed.kind === "cancel") {
					if (hasAmbiguousActiveLoops(setupSessionId)) {
						return "Multiple active Ralph loops were found. Cancel from the original session."
					}
					const removed = clearLoop(setupSessionId)
					return removed
						? `Cancelled Ralph loop at iteration ${removed.iteration}.`
						: "No active Ralph loop."
				}
				if (parsed.kind === "error") {
					return `${parsed.message}\n\n${formatHelp()}`
				}
				const loop = saveNewLoop(
					{
						prompt: parsed.prompt,
						iteration: 1,
						maxIterations: parsed.maxIterations,
						createdAt: new Date().toISOString(),
						...(parsed.completionPromise
							? { completionPromise: parsed.completionPromise }
							: {}),
					},
					setupSessionId,
				)
				return {
					reply: `Started Ralph loop: iteration 1 of ${loop.maxIterations}.`,
					submitPrompt: iterationPrompt(loop),
				}
			},
		})

		api.registerCommand({
			name: "cancel-ralph",
			description: "Cancel the active Ralph loop in this Cline session.",
			handler: () => {
				if (hasAmbiguousActiveLoops(setupSessionId)) {
					return "Multiple active Ralph loops were found. Cancel from the original session."
				}
				const removed = clearLoop(setupSessionId)
				return removed
					? `Cancelled Ralph loop at iteration ${removed.iteration}.`
					: "No active Ralph loop."
			},
		})

		api.registerRule({
			id: "ralph-loop:active-loop",
			source: PLUGIN_NAME,
			content: activeLoopRule,
		})
	},

	hooks: {
		beforeRun() {
			claimPendingLoop(setupSessionId)
		},

		afterRun({ result }) {
			if (result.status !== "completed") {
				return
			}
			const loop = currentLoop(setupSessionId)
			if (!loop || !loop.sessionId) {
				return
			}
			if (outputMatchesPromise(result.outputText, loop.completionPromise)) {
				clearLoop(loop.sessionId)
				return
			}
			if (loop.iteration >= loop.maxIterations) {
				clearLoop(loop.sessionId)
				return
			}
			const next = {
				...loop,
				iteration: loop.iteration + 1,
			}
			updateLoop(next)
			emitQueueMessage(next.sessionId, iterationPrompt(next))
		},
	},
}

export default plugin
