import { execFile } from "node:child_process"
import { existsSync, statSync } from "node:fs"
import { extname, isAbsolute, relative, resolve } from "node:path"
import { promisify } from "node:util"
import { type AgentPlugin, createTool } from "@cline/core"

const execFileAsync = promisify(execFile)
const TIMEOUT_MS = 30_000
const MAX_BUFFER = 1024 * 1024

type GoplsCheckInput = {
	file?: string
}

type CommandError = Error & {
	code?: string | number
	signal?: string
	stdout?: string | Buffer
	stderr?: string | Buffer
}

function toText(value: string | Buffer | undefined): string {
	return Buffer.isBuffer(value) ? value.toString("utf8") : value ?? ""
}

function isInsideWorkspace(workspaceRoot: string, filePath: string): boolean {
	const rel = relative(workspaceRoot, filePath)
	return rel === "" || (!rel.startsWith("..") && !isAbsolute(rel))
}

function parseDiagnostics(output: string) {
	return output
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter(Boolean)
		.map((line) => {
			const match = line.match(/^(.*?):(\d+):(\d+):\s*(.*)$/)
			if (!match) {
				return { raw: line, message: line }
			}

			return {
				file: match[1],
				line: Number(match[2]),
				column: Number(match[3]),
				message: match[4],
				raw: line,
			}
		})
}

function createGoplsCheckTool(workspaceRoot: string) {
	return createTool({
		name: "gopls_check",
		description:
			"Run `gopls check` on one Go source file in the current workspace and return diagnostics. " +
			"Use this when you need Go compiler/type diagnostics for a specific file without running the whole test suite.",
		inputSchema: {
			type: "object",
			properties: {
				file: {
					type: "string",
					description:
						"Path to a .go file, either absolute or relative to the current workspace.",
				},
			},
			required: ["file"],
			additionalProperties: false,
		},
		timeoutMs: TIMEOUT_MS,
		retryable: false,
		async execute(input: unknown) {
			const { file } = (input ?? {}) as GoplsCheckInput
			if (typeof file !== "string" || file.trim() === "") {
				return { ok: false, error: "file is required" }
			}

			const resolvedFile = isAbsolute(file)
				? resolve(file)
				: resolve(workspaceRoot, file)

			if (!isInsideWorkspace(workspaceRoot, resolvedFile)) {
				return {
					ok: false,
					error: "file must be inside the current workspace",
					workspaceRoot,
					file: resolvedFile,
				}
			}

			if (extname(resolvedFile) !== ".go") {
				return {
					ok: false,
					error: "file must be a .go source file",
					file: resolvedFile,
				}
			}

			if (!existsSync(resolvedFile)) {
				return {
					ok: false,
					error: "file does not exist",
					file: resolvedFile,
				}
			}

			if (!statSync(resolvedFile).isFile()) {
				return {
					ok: false,
					error: "file is not a regular file",
					file: resolvedFile,
				}
			}

			try {
				const { stdout, stderr } = await execFileAsync(
					"gopls",
					["check", resolvedFile],
					{
						cwd: workspaceRoot,
						timeout: TIMEOUT_MS,
						maxBuffer: MAX_BUFFER,
					},
				)
				const output = [stdout, stderr].filter(Boolean).join("\n")

				return {
					ok: true,
					file: resolvedFile,
					relativeFile: relative(workspaceRoot, resolvedFile),
					diagnostics: parseDiagnostics(output),
					hasDiagnostics: output.trim().length > 0,
					stdout: stdout.trim(),
					stderr: stderr.trim(),
				}
			} catch (error) {
				const commandError = error as CommandError
				const stdout = toText(commandError.stdout)
				const stderr = toText(commandError.stderr)

				if (commandError.code === "ENOENT") {
					return {
						ok: false,
						error: "gopls is not installed or is not on PATH",
						setup: "Install it with `go install golang.org/x/tools/gopls@latest` and ensure GOPATH/bin is on PATH.",
						file: resolvedFile,
						relativeFile: relative(workspaceRoot, resolvedFile),
					}
				}

				const output = [stdout, stderr].filter(Boolean).join("\n")
				const diagnostics = parseDiagnostics(output)

				if (diagnostics.length > 0) {
					return {
						ok: true,
						file: resolvedFile,
						relativeFile: relative(workspaceRoot, resolvedFile),
						diagnostics,
						hasDiagnostics: true,
						exitCode: commandError.code,
						signal: commandError.signal,
						stdout: stdout.trim(),
						stderr: stderr.trim(),
					}
				}

				return {
					ok: false,
					error: "gopls check failed without diagnostic output",
					file: resolvedFile,
					relativeFile: relative(workspaceRoot, resolvedFile),
					exitCode: commandError.code,
					signal: commandError.signal,
					diagnostics,
					stdout: stdout.trim(),
					stderr: stderr.trim(),
					message: commandError.message,
				}
			}
		},
	})
}

const plugin: AgentPlugin = {
	name: "gopls-lsp",
	manifest: {
		capabilities: ["tools"],
	},
	setup(api, ctx) {
		const workspaceRoot = resolve(ctx.workspaceInfo?.rootPath ?? process.cwd())
		api.registerTool(createGoplsCheckTool(workspaceRoot))
	},
}

export default plugin
