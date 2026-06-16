import {
	existsSync,
	closeSync,
	mkdtempSync,
	openSync,
	readFileSync,
	readSync,
	realpathSync,
	rmSync,
	statSync,
} from "node:fs"
import { tmpdir } from "node:os"
import { isAbsolute, join, relative, resolve } from "node:path"
import { spawn } from "node:child_process"
import { type AgentPlugin, createTool } from "@cline/sdk"

const OUTPUT_LIMIT = 120_000
const REPORT_LIMIT = 250_000
const DEFAULT_TIMEOUT_MS = 60_000
const CHECK_LEVELS = ["Error", "Warning", "Information"] as const

type LuaDiagnosticsInput = {
	path?: string
	checkLevel?: (typeof CHECK_LEVELS)[number]
	timeoutMs?: number
}

let workspaceRoot: string | undefined

function trimOutput(value: string): { text: string; truncated: boolean } {
	if (value.length <= OUTPUT_LIMIT) {
		return { text: value, truncated: false }
	}
	return {
		text: value.slice(0, OUTPUT_LIMIT),
		truncated: true,
	}
}

function readFilePrefix(path: string, maxBytes: number): string {
	const fd = openSync(path, "r")
	try {
		const buffer = Buffer.alloc(maxBytes)
		const bytesRead = readSync(fd, buffer, 0, maxBytes, 0)
		return buffer.subarray(0, bytesRead).toString("utf8")
	} finally {
		closeSync(fd)
	}
}

function isInside(parent: string, child: string): boolean {
	const rel = relative(parent, child)
	return rel === "" || (!rel.startsWith("..") && !isAbsolute(rel))
}

function resolveTarget(inputPath: string | undefined):
	| {
			ok: true
			target: string
			requested: string
	  }
	| {
			ok: false
			error: string
	  } {
	const root = workspaceRoot
	if (!root) {
		return { ok: false, error: "No workspace root is available." }
	}

	const requested = inputPath?.trim() || "."
	const realRoot = realpathSync(root)
	const candidate = resolve(root, requested)
	if (!existsSync(candidate)) {
		return { ok: false, error: `Path does not exist: ${requested}` }
	}
	const realCandidate = realpathSync(candidate)
	if (!isInside(realRoot, realCandidate)) {
		return {
			ok: false,
			error: `Path is outside the workspace: ${requested}`,
		}
	}

	const info = statSync(realCandidate)
	if (info.isDirectory()) {
		return { ok: true, target: realCandidate, requested }
	}
	return { ok: false, error: `Path is not a directory: ${requested}` }
}

function readReport(reportPath: string): Record<string, unknown> {
	if (!existsSync(reportPath)) {
		return {}
	}

	const size = statSync(reportPath).size
	if (size > REPORT_LIMIT) {
		return {
			reportSizeBytes: size,
			reportTruncated: true,
			reportText: readFilePrefix(reportPath, OUTPUT_LIMIT),
		}
	}

	const raw = readFileSync(reportPath, "utf8")
	try {
		return {
			reportSizeBytes: size,
			report: JSON.parse(raw),
		}
	} catch (error) {
		return {
			reportSizeBytes: size,
			reportParseError: error instanceof Error ? error.message : String(error),
			reportText: trimOutput(raw).text,
		}
	}
}

function runLuaDiagnostics(
	input: LuaDiagnosticsInput,
): Promise<Record<string, unknown>> {
	const resolved = resolveTarget(input.path)
	if (!resolved.ok) {
		return Promise.resolve({ ok: false, error: resolved.error })
	}

	const checkLevel = CHECK_LEVELS.includes(input.checkLevel ?? "Warning")
		? (input.checkLevel ?? "Warning")
		: "Warning"
	const timeoutMs = Math.max(
		5_000,
		Math.min(input.timeoutMs ?? DEFAULT_TIMEOUT_MS, DEFAULT_TIMEOUT_MS),
	)
	const logDir = mkdtempSync(join(tmpdir(), "cline-lua-lsp-"))
	const reportPath = join(logDir, "check.json")
	const args = [
		`--check=${resolved.target}`,
		`--checklevel=${checkLevel}`,
		`--logpath=${logDir}`,
	]

	return new Promise((resolveResult) => {
		let stdout = ""
		let stderr = ""
		let timedOut = false
		let settled = false
		let timer: ReturnType<typeof setTimeout> | undefined
		let hardKillTimer: ReturnType<typeof setTimeout> | undefined
		const child = spawn("lua-language-server", args, {
			cwd: resolved.target,
			stdio: ["ignore", "pipe", "pipe"],
			shell: false,
		})

		function finish(result: Record<string, unknown>): void {
			if (settled) {
				return
			}
			settled = true
			if (timer) {
				clearTimeout(timer)
			}
			if (hardKillTimer) {
				clearTimeout(hardKillTimer)
			}
			rmSync(logDir, { recursive: true, force: true })
			resolveResult(result)
		}

		timer = setTimeout(() => {
			timedOut = true
			child.kill("SIGTERM")
			hardKillTimer = setTimeout(() => {
				child.kill("SIGKILL")
				const out = trimOutput(stdout)
				const err = trimOutput(stderr)
				finish({
					ok: false,
					error: "lua-language-server timed out.",
					target: resolved.target,
					requested: resolved.requested,
					checkLevel,
					timedOut: true,
					stdout: out.text,
					stderr: err.text,
					truncated: out.truncated || err.truncated,
				})
			}, 2_000)
		}, timeoutMs)

		child.stdout?.on("data", (chunk) => {
			stdout += String(chunk)
		})
		child.stderr?.on("data", (chunk) => {
			stderr += String(chunk)
		})
		child.on("error", (error) => {
			finish({
				ok: false,
				error: error.message,
				command: "lua-language-server",
			})
		})
		child.on("close", (code) => {
			const out = trimOutput(stdout)
			const err = trimOutput(stderr)
			finish({
				ok: code === 0 && !timedOut,
				target: resolved.target,
				requested: resolved.requested,
				checkLevel,
				exitCode: code,
				timedOut,
				...readReport(reportPath),
				stdout: out.text,
				stderr: err.text,
				truncated: out.truncated || err.truncated,
			})
		})
	})
}

const plugin: AgentPlugin = {
	name: "lua-lsp",
	manifest: {
		capabilities: ["tools"],
	},

	setup(api, ctx) {
		workspaceRoot = ctx.workspaceInfo?.rootPath
		api.registerTool(
			createTool<LuaDiagnosticsInput, Record<string, unknown>>({
				name: "lua_diagnostics",
				description:
					"Run LuaLS diagnostics for a Lua workspace directory and return its diagnosis report. Requires lua-language-server on PATH.",
				inputSchema: {
					type: "object",
					properties: {
						path: {
							type: "string",
							description:
								"Workspace-relative Lua project directory to check. Defaults to the current workspace.",
						},
						checkLevel: {
							type: "string",
							enum: CHECK_LEVELS,
							description:
								"Minimum diagnostic level to include. Defaults to Warning.",
						},
						timeoutMs: {
							type: "number",
							description: "Optional timeout in milliseconds. Maximum is 60000.",
						},
					},
					additionalProperties: false,
				},
				retryable: false,
				timeoutMs: DEFAULT_TIMEOUT_MS + 5_000,
				execute: async (input) => runLuaDiagnostics(input),
			}),
		)
	},
}

export default plugin
