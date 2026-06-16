import { spawn } from "node:child_process"
import { access, realpath } from "node:fs/promises"
import { basename, extname, isAbsolute, relative, resolve } from "node:path"
import { type AgentPlugin, createTool } from "@cline/core"

type RubyDiagnosticsInput = {
	file: string
}

type CommandResult = {
	command: string
	args: string[]
	exitCode: number | null
	stdout: string
	stderr: string
}

const SUPPORTED_EXTENSIONS = new Set([".rb", ".rake", ".gemspec", ".ru", ".erb"])
const SUPPORTED_BASENAMES = new Set(["Rakefile", "Gemfile", "Guardfile", "Capfile"])
const MAX_OUTPUT_LENGTH = 12000
const TIMEOUT_MS = 20000
const KILL_AFTER_TIMEOUT_MS = 1000

function appendBounded(current: string, chunk: string): string {
	if (current.length >= MAX_OUTPUT_LENGTH) {
		return current
	}
	const next = current + chunk
	if (next.length <= MAX_OUTPUT_LENGTH) {
		return next
	}
	return `${next.slice(0, MAX_OUTPUT_LENGTH)}\n[truncated]`
}

function runCommand(
	command: string,
	args: string[],
	options: { cwd: string; stdin?: string },
): Promise<CommandResult> {
	return new Promise((resolveCommand) => {
		const child = spawn(command, args, {
			cwd: options.cwd,
			stdio: ["pipe", "pipe", "pipe"],
		})

		let stdout = ""
		let stderr = ""
		let settled = false
		let killTimer: ReturnType<typeof setTimeout> | undefined

		function finish(exitCode: number | null, fallbackError?: string) {
			if (settled) return
			settled = true
			clearTimeout(timer)
			if (killTimer) clearTimeout(killTimer)
			resolveCommand({
				command,
				args,
				exitCode,
				stdout,
				stderr: fallbackError ?? stderr,
			})
		}

		const timer = setTimeout(() => {
			stderr = appendBounded(stderr, `\nTimed out after ${TIMEOUT_MS}ms.`)
			child.kill("SIGTERM")
			killTimer = setTimeout(() => {
				if (!settled) {
					child.kill("SIGKILL")
				}
			}, KILL_AFTER_TIMEOUT_MS)
		}, TIMEOUT_MS)

		child.stdout.on("data", (chunk) => {
			stdout = appendBounded(stdout, String(chunk))
		})
		child.stderr.on("data", (chunk) => {
			stderr = appendBounded(stderr, String(chunk))
		})
		child.on("error", (error) => {
			finish(null, error.message)
		})
		child.on("close", (exitCode) => {
			finish(exitCode)
		})

		child.stdin.end(options.stdin ?? "")
	})
}

function isInsideWorkspace(workspaceRoot: string, filePath: string): boolean {
	const rel = relative(workspaceRoot, filePath)
	return rel === "" || (!rel.startsWith("..") && !isAbsolute(rel))
}

async function resolveWorkspaceFile(workspaceRoot: string, file: string) {
	const candidate = resolve(workspaceRoot, file)
	await access(candidate)
	const resolvedRoot = await realpath(workspaceRoot)
	const resolvedFile = await realpath(candidate)
	if (!isInsideWorkspace(resolvedRoot, resolvedFile)) {
		throw new Error("File must be inside the active workspace.")
	}
	return { resolvedRoot, resolvedFile }
}

const plugin: AgentPlugin = {
	name: "ruby-lsp",
	manifest: {
		capabilities: ["tools"],
	},

	setup(api, ctx) {
		const workspaceRoot = ctx.workspaceInfo?.rootPath ?? process.cwd()

		api.registerTool(
			createTool({
				name: "ruby_diagnostics",
				description:
					"Run bounded Ruby syntax diagnostics for a workspace Ruby file. " +
					"Supports .rb, .rake, .gemspec, .ru, and .erb files using the user's installed Ruby tooling.",
				inputSchema: {
					type: "object",
					properties: {
						file: {
							type: "string",
							description:
								"Ruby file to check. Relative paths resolve from the active workspace.",
						},
					},
					required: ["file"],
					additionalProperties: false,
				},
				timeoutMs: TIMEOUT_MS + 5000,
				retryable: false,
				async execute(input: unknown) {
					const { file } = (input ?? {}) as RubyDiagnosticsInput
					if (typeof file !== "string" || file.trim() === "") {
						return { ok: false, error: "`file` must be a non-empty string." }
					}

					let resolvedRoot: string
					let resolvedFile: string
					try {
						const resolved = await resolveWorkspaceFile(workspaceRoot, file)
						resolvedRoot = resolved.resolvedRoot
						resolvedFile = resolved.resolvedFile
					} catch (error) {
						return {
							ok: false,
							error: error instanceof Error ? error.message : String(error),
						}
					}

					const extension = extname(resolvedFile)
					const name = basename(resolvedFile)
					const isSupported =
						SUPPORTED_EXTENSIONS.has(extension) || SUPPORTED_BASENAMES.has(name)
					if (!isSupported) {
						return {
							ok: false,
							file: resolvedFile,
							error: `Unsupported Ruby file "${name}". Supported extensions: ${Array.from(
								SUPPORTED_EXTENSIONS,
							).join(", ")}. Supported basenames: ${Array.from(
								SUPPORTED_BASENAMES,
							).join(", ")}.`,
						}
					}

					if (extension === ".erb") {
						const erb = await runCommand("erb", ["-x", "-T", "-", resolvedFile], {
							cwd: resolvedRoot,
						})
						if (erb.exitCode !== 0) {
							return {
								ok: false,
								file: resolvedFile,
								check: "erb -x",
								result: erb,
							}
						}
						const ruby = await runCommand("ruby", ["-c"], {
							cwd: resolvedRoot,
							stdin: erb.stdout,
						})
						return {
							ok: ruby.exitCode === 0,
							file: resolvedFile,
							check: "erb -x | ruby -c",
							result: ruby,
						}
					}

					const ruby = await runCommand("ruby", ["-c", resolvedFile], {
						cwd: resolvedRoot,
					})
					return {
						ok: ruby.exitCode === 0,
						file: resolvedFile,
						check: "ruby -c",
						result: ruby,
					}
				},
			}),
		)
	},
}

export default plugin
