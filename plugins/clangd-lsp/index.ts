import { execFile } from "node:child_process"
import { existsSync, statSync } from "node:fs"
import { dirname, isAbsolute, relative, resolve } from "node:path"
import { promisify } from "node:util"
import { type AgentPlugin, createTool } from "@cline/sdk"

const execFileAsync = promisify(execFile)

const CPP_EXTENSIONS = new Set([
	".c",
	".cc",
	".cpp",
	".cxx",
	".c++",
	".h",
	".hh",
	".hpp",
	".hxx",
	".h++",
	".ipp",
	".inl",
	".tpp",
	".txx",
])

type ClangdCheckInput = {
	file: string
	compileCommandsDir?: string
}

function getExtension(path: string): string {
	const index = path.lastIndexOf(".")
	return index >= 0 ? path.slice(index).toLowerCase() : ""
}

function isDirectory(path: string): boolean {
	try {
		return statSync(path).isDirectory()
	} catch {
		return false
	}
}

function trimOutput(value: string): string {
	const maxLength = 60_000
	if (value.length <= maxLength) {
		return value
	}
	return `${value.slice(0, maxLength)}\n[output truncated]`
}

function isInsideWorkspace(workspaceRoot: string, path: string): boolean {
	const rel = relative(workspaceRoot, path)
	return rel === "" || (!rel.startsWith("..") && !isAbsolute(rel))
}

function resolveWorkspacePath(workspaceRoot: string, userPath: string): string {
	return resolve(workspaceRoot, userPath)
}

function createClangdCheckTool(workspaceRoot: string) {
	return createTool({
		name: "clangd_check",
		description:
			"Run local clangd diagnostics for a C/C++ source or header file inside the workspace. Uses clangd --check and never modifies files.",
		inputSchema: {
			type: "object",
			properties: {
				file: {
					type: "string",
					description: "Workspace-relative path to a C/C++ file.",
				},
				compileCommandsDir: {
					type: "string",
					description:
						"Optional workspace-relative directory containing compile_commands.json. Defaults to the file's directory and parent discovery by clangd.",
				},
			},
			required: ["file"],
			additionalProperties: false,
		},
		timeoutMs: 45_000,
		retryable: false,
		async execute(input: unknown) {
			if (!input || typeof input !== "object") {
				return { ok: false, error: "input must be an object" }
			}

			const { file, compileCommandsDir } = input as ClangdCheckInput
			if (!file || typeof file !== "string") {
				return { ok: false, error: "file is required" }
			}
			if (
				compileCommandsDir !== undefined &&
				typeof compileCommandsDir !== "string"
			) {
				return { ok: false, error: "compileCommandsDir must be a string" }
			}

			const filePath = resolveWorkspacePath(workspaceRoot, file)
			if (!isInsideWorkspace(workspaceRoot, filePath)) {
				return {
					ok: false,
					file: filePath,
					workspaceRoot,
					error: "file must be inside the workspace",
				}
			}
			if (!existsSync(filePath) || !statSync(filePath).isFile()) {
				return { ok: false, file: filePath, error: "file does not exist" }
			}

			const extension = getExtension(filePath)
			if (!CPP_EXTENSIONS.has(extension)) {
				return {
					ok: false,
					file: filePath,
					error: `unsupported C/C++ file extension: ${extension || "(none)"}`,
				}
			}

			const args = [`--check=${filePath}`]
			if (compileCommandsDir) {
				const compileDir = resolveWorkspacePath(workspaceRoot, compileCommandsDir)
				if (!isInsideWorkspace(workspaceRoot, compileDir)) {
					return {
						ok: false,
						file: filePath,
						compileCommandsDir: compileDir,
						workspaceRoot,
						error: "compileCommandsDir must be inside the workspace",
					}
				}
				if (!isDirectory(compileDir)) {
					return {
						ok: false,
						file: filePath,
						compileCommandsDir: compileDir,
						error: "compileCommandsDir must be an existing directory",
					}
				}
				args.push(`--compile-commands-dir=${compileDir}`)
			}

			try {
				const result = await execFileAsync("clangd", args, {
					cwd: dirname(filePath),
					timeout: 45_000,
					maxBuffer: 1024 * 1024,
				})
				return {
					ok: true,
					file: filePath,
					command: "clangd",
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
						file: filePath,
						command: "clangd",
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
								: "clangd check failed",
					}
				}
				return {
					ok: false,
					file: filePath,
					command: "clangd",
					args,
					error: String(error),
				}
			}
		},
	})
}

const plugin: AgentPlugin = {
	name: "clangd-lsp",
	manifest: {
		capabilities: ["tools"],
	},

	setup(api, ctx) {
		const workspaceRoot = resolve(ctx.workspaceInfo?.rootPath ?? process.cwd())
		api.registerTool(createClangdCheckTool(workspaceRoot))
	},
}

export default plugin
