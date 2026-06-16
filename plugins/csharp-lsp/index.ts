import { execFile } from "node:child_process"
import { readdirSync, realpathSync, statSync } from "node:fs"
import { extname, isAbsolute, relative, resolve } from "node:path"
import { promisify } from "node:util"
import { type AgentPlugin, createTool } from "@cline/core"

const execFileAsync = promisify(execFile)
const TARGET_EXTENSIONS = new Set([".sln", ".slnx", ".csproj"])

type CsharpBuildDiagnosticsInput = {
	target?: string
	configuration?: string
	noRestore?: boolean
	verbosity?: "quiet" | "minimal" | "normal"
}

function isInsideWorkspace(workspaceRoot: string, path: string): boolean {
	try {
		const workspaceRealPath = realpathSync(workspaceRoot)
		const targetRealPath = realpathSync(path)
		const rel = relative(workspaceRealPath, targetRealPath)
		return rel === "" || (!rel.startsWith("..") && !isAbsolute(rel))
	} catch {
		return false
	}
}

function isFile(path: string): boolean {
	try {
		return statSync(path).isFile()
	} catch {
		return false
	}
}

function trimOutput(value: string): string {
	const maxLength = 80_000
	if (value.length <= maxLength) return value
	return `${value.slice(0, maxLength)}\n[output truncated]`
}

function findDefaultTarget(workspaceRoot: string): string | undefined {
	const entries = readdirSync(workspaceRoot)
	const candidates = entries
		.map((entry) => resolve(workspaceRoot, entry))
		.filter((entry) => isFile(entry) && TARGET_EXTENSIONS.has(extname(entry)))
		.sort((a, b) => {
			const aExt = extname(a)
			const bExt = extname(b)
			if (aExt === bExt) return a.localeCompare(b)
			if (aExt === ".sln") return -1
			if (bExt === ".sln") return 1
			if (aExt === ".slnx") return -1
			if (bExt === ".slnx") return 1
			return a.localeCompare(b)
		})
	return candidates[0]
}

function resolveTarget(workspaceRoot: string, target: string | undefined) {
	const targetPath = target
		? resolve(workspaceRoot, target)
		: findDefaultTarget(workspaceRoot)
	if (!targetPath) {
		return {
			ok: false as const,
			error:
				"target is required when the workspace root does not contain a .sln, .slnx, or .csproj file",
		}
	}
	if (!isFile(targetPath)) {
		return { ok: false as const, target: targetPath, error: "target does not exist" }
	}
	if (!isInsideWorkspace(workspaceRoot, targetPath)) {
		return {
			ok: false as const,
			target: targetPath,
			error: "target must be inside the workspace",
		}
	}
	const extension = extname(targetPath)
	if (!TARGET_EXTENSIONS.has(extension)) {
		return {
			ok: false as const,
			target: targetPath,
			error: "target must be a .sln, .slnx, or .csproj file",
		}
	}
	return { ok: true as const, target: targetPath }
}

function createCsharpBuildDiagnosticsTool(workspaceRoot: string) {
	return createTool({
		name: "csharp_build_diagnostics",
		description:
			"Run local .NET build diagnostics for a C# solution or project inside the workspace. Uses dotnet build and returns compiler diagnostics. This may write normal build outputs such as bin/ and obj/.",
		inputSchema: {
			type: "object",
			properties: {
				target: {
					type: "string",
					description:
						"Optional workspace-relative path to a .sln, .slnx, or .csproj file. Defaults to a solution or project in the workspace root.",
				},
				configuration: {
					type: "string",
					description: "Optional build configuration such as Debug or Release.",
				},
				noRestore: {
					type: "boolean",
					description:
						"Whether to pass --no-restore. Defaults to true to avoid implicit package restore and network access.",
				},
				verbosity: {
					type: "string",
					enum: ["quiet", "minimal", "normal"],
					description: "dotnet build verbosity. Defaults to minimal.",
				},
			},
			additionalProperties: false,
		},
		timeoutMs: 120_000,
		retryable: false,
		async execute(input: unknown) {
			if (!input || typeof input !== "object") {
				return { ok: false, error: "input must be an object" }
			}

			const options = input as CsharpBuildDiagnosticsInput
			if (options.target !== undefined && typeof options.target !== "string") {
				return { ok: false, error: "target must be a string" }
			}
			if (
				options.configuration !== undefined &&
				typeof options.configuration !== "string"
			) {
				return { ok: false, error: "configuration must be a string" }
			}
			if (options.noRestore !== undefined && typeof options.noRestore !== "boolean") {
				return { ok: false, error: "noRestore must be a boolean" }
			}

			const verbosity = options.verbosity ?? "minimal"
			if (!["quiet", "minimal", "normal"].includes(verbosity)) {
				return { ok: false, error: "verbosity must be quiet, minimal, or normal" }
			}

			const resolved = resolveTarget(workspaceRoot, options.target)
			if (!resolved.ok) return resolved

			const args = ["build", resolved.target, "--nologo", "--verbosity", verbosity]
			if (options.noRestore !== false) args.push("--no-restore")
			if (options.configuration?.trim()) {
				args.push("--configuration", options.configuration.trim())
			}

			try {
				const result = await execFileAsync("dotnet", args, {
					cwd: workspaceRoot,
					timeout: 120_000,
					maxBuffer: 16 * 1024 * 1024,
				})
				return {
					ok: true,
					target: resolved.target,
					command: "dotnet",
					args,
					stdout: trimOutput(result.stdout),
					stderr: trimOutput(result.stderr),
				}
			} catch (error) {
				if (error && typeof error === "object") {
					const maybe = error as {
						code?: unknown
						killed?: unknown
						signal?: unknown
						stdout?: unknown
						stderr?: unknown
						message?: unknown
					}
					return {
						ok: false,
						target: resolved.target,
						command: "dotnet",
						args,
						exitCode: maybe.code,
						killed: maybe.killed,
						signal: maybe.signal,
						stdout:
							typeof maybe.stdout === "string" ? trimOutput(maybe.stdout) : "",
						stderr:
							typeof maybe.stderr === "string" ? trimOutput(maybe.stderr) : "",
						error:
							typeof maybe.message === "string"
								? maybe.message
								: "dotnet build failed",
					}
				}
				return {
					ok: false,
					target: resolved.target,
					command: "dotnet",
					args,
					error: String(error),
				}
			}
		},
	})
}

const plugin: AgentPlugin = {
	name: "csharp-lsp",
	manifest: {
		capabilities: ["tools"],
	},

	setup(api, ctx) {
		const workspaceRoot = resolve(ctx.workspaceInfo?.rootPath ?? process.cwd())
		api.registerTool(createCsharpBuildDiagnosticsTool(workspaceRoot))
	},
}

export default plugin
