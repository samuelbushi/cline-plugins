import { execFile } from "node:child_process"
import { existsSync, realpathSync } from "node:fs"
import { isAbsolute, relative, resolve, sep } from "node:path"
import { promisify } from "node:util"
import { type AgentPlugin, createTool } from "@cline/sdk"

const execFileAsync = promisify(execFile)
const MAX_OUTPUT_BYTES = 4 * 1024 * 1024

type PyrightDiagnostic = {
	file?: string
	severity?: string
	message?: string
	rule?: string
	range?: {
		start?: { line?: number; character?: number }
		end?: { line?: number; character?: number }
	}
}

type PyrightOutput = {
	version?: string
	time?: string
	generalDiagnostics?: PyrightDiagnostic[]
	summary?: Record<string, unknown>
}

function messageFromError(error: unknown) {
	return error instanceof Error ? error.message : String(error)
}

function isInsideRoot(root: string, target: string) {
	const rel = relative(root, target)
	return rel === "" || (rel !== ".." && !rel.startsWith(`..${sep}`) && !isAbsolute(rel))
}

function normalizeTarget(workspaceRoot: string, inputPath: unknown) {
	const rawPath = typeof inputPath === "string" && inputPath.trim() ? inputPath.trim() : "."
	const candidate = isAbsolute(rawPath) ? resolve(rawPath) : resolve(workspaceRoot, rawPath)

	if (!existsSync(candidate)) {
		return { error: `Path does not exist: ${candidate}` }
	}

	let realWorkspace: string
	let realTarget: string
	try {
		realWorkspace = realpathSync(workspaceRoot)
		realTarget = realpathSync(candidate)
	} catch (error) {
		return { error: `Failed to resolve path: ${messageFromError(error)}` }
	}

	const rel = relative(realWorkspace, realTarget)

	if (rel === ".." || rel.startsWith(`..${sep}`) || isAbsolute(rel)) {
		return { error: `Path must stay inside the workspace: ${candidate}` }
	}

	return { target: realTarget, displayPath: rel || ".", realWorkspace }
}

function normalizeDiagnosticFile(file: string | undefined, realWorkspace: string) {
	if (!file) {
		return {}
	}

	const candidate = isAbsolute(file) ? resolve(file) : resolve(realWorkspace, file)
	let normalized = candidate
	try {
		normalized = existsSync(candidate) ? realpathSync(candidate) : candidate
	} catch {
		normalized = candidate
	}

	if (!isInsideRoot(realWorkspace, normalized)) {
		return { outsideWorkspace: true }
	}

	const rel = relative(realWorkspace, normalized)
	return { file: rel ? rel.split(sep).join("/") : "." }
}

function mapDiagnostic(diagnostic: PyrightDiagnostic, realWorkspace: string) {
	const start = diagnostic.range?.start
	const end = diagnostic.range?.end

	return {
		...normalizeDiagnosticFile(diagnostic.file, realWorkspace),
		severity: diagnostic.severity,
		message: diagnostic.message,
		rule: diagnostic.rule,
		start:
			start && typeof start.line === "number" && typeof start.character === "number"
				? { line: start.line + 1, column: start.character + 1 }
				: undefined,
		end:
			end && typeof end.line === "number" && typeof end.character === "number"
				? { line: end.line + 1, column: end.character + 1 }
				: undefined,
	}
}

async function runPyright(target: string, cwd: string) {
	try {
		const { stdout, stderr } = await execFileAsync(
			"pyright",
			["--outputjson", target],
			{
				cwd,
				maxBuffer: MAX_OUTPUT_BYTES,
				timeout: 60000,
			},
		)
		return { stdout, stderr, exitCode: 0 }
	} catch (error) {
		const err = error as NodeJS.ErrnoException & {
			stdout?: string
			stderr?: string
			code?: string | number
		}

		if (err.code === "ENOENT") {
			return {
				missingDependency: true,
				error:
					"`pyright` was not found on PATH. Install it in the project or globally, then retry.",
			}
		}

		return {
			stdout: err.stdout ?? "",
			stderr: err.stderr ?? err.message,
			exitCode: typeof err.code === "number" ? err.code : 1,
		}
	}
}

const plugin: AgentPlugin = {
	name: "pyright-lsp",
	manifest: {
		capabilities: ["tools"],
	},

	setup(api, ctx) {
		const workspaceRoot = ctx.workspaceInfo?.rootPath ?? process.cwd()

		api.registerTool(
			createTool({
				name: "pyright_diagnostics",
				description:
					"Run Pyright static analysis for a Python file or directory inside the current workspace. Requires `pyright` to be installed by the user.",
				inputSchema: {
					type: "object",
					properties: {
						path: {
							type: "string",
							description:
								"Workspace-relative Python file or directory to check. Defaults to the workspace root.",
						},
					},
					additionalProperties: false,
				},
				timeoutMs: 70000,
				retryable: false,
				async execute(input: unknown) {
					const normalized = normalizeTarget(
						workspaceRoot,
						(input as { path?: unknown } | undefined)?.path,
					)

					if ("error" in normalized) {
						return { ok: false, error: normalized.error }
					}

					const result = await runPyright(
						normalized.target,
						normalized.realWorkspace,
					)

					if (result.missingDependency) {
						return {
							ok: false,
							missingDependency: "pyright",
							error: result.error,
						}
					}

					let parsed: PyrightOutput | undefined
					try {
						parsed = JSON.parse(result.stdout || "{}") as PyrightOutput
					} catch {
						return {
							ok: false,
							exitCode: result.exitCode,
							error: "Pyright did not return valid JSON.",
							stdout: result.stdout?.slice(0, 4000),
							stderr: result.stderr?.slice(0, 4000),
						}
					}

					const diagnostics = (parsed.generalDiagnostics ?? []).map(
						(diagnostic) =>
							mapDiagnostic(diagnostic, normalized.realWorkspace),
					)

					return {
						ok: true,
						typeCheckPassed: result.exitCode === 0,
						exitCode: result.exitCode,
						target: normalized.displayPath,
						version: parsed.version,
						summary: parsed.summary,
						diagnosticCount: diagnostics.length,
						diagnostics,
						stderr: result.stderr?.trim() || undefined,
					}
				},
			}),
		)
	},
}

export default plugin
