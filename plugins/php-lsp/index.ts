import { execFile } from "node:child_process"
import { existsSync, readdirSync, realpathSync, statSync } from "node:fs"
import { isAbsolute, join, relative, resolve } from "node:path"
import { type AgentPlugin, createTool } from "@cline/sdk"

type PhpDiagnosticsInput = {
	target: string
	maxFiles?: number
}

type PhpLintResult = {
	file: string
	ok: boolean
	exitCode?: number
	stdout: string
	stderr: string
	error?: string
}

const SKIP_DIRS = new Set([
	".git",
	"node_modules",
	"vendor",
	"dist",
	"build",
	"coverage",
	"cache",
	"tmp",
])

function normalizeMaxFiles(value: unknown): number {
	if (typeof value !== "number" || !Number.isFinite(value)) {
		return 50
	}
	return Math.max(1, Math.min(200, Math.floor(value)))
}

function isInside(root: string, target: string): boolean {
	const rel = relative(root, target)
	return rel === "" || (!rel.startsWith("..") && !isAbsolute(rel))
}

function collectPhpFiles(
	target: string,
	maxFiles: number,
): { files: string[]; truncated: boolean } {
	const stat = statSync(target)
	if (stat.isFile()) {
		return { files: target.endsWith(".php") ? [target] : [], truncated: false }
	}
	if (!stat.isDirectory()) {
		return { files: [], truncated: false }
	}

	const files: string[] = []
	let truncated = false
	const visit = (directory: string) => {
		if (truncated) {
			return
		}
		const entries = readdirSync(directory, { withFileTypes: true }).sort((a, b) =>
			a.name.localeCompare(b.name),
		)
		for (const entry of entries) {
			if (truncated) {
				return
			}
			const entryPath = join(directory, entry.name)
			if (entry.isDirectory()) {
				if (!SKIP_DIRS.has(entry.name)) {
					visit(entryPath)
				}
				continue
			}
			if (entry.isFile() && entry.name.endsWith(".php")) {
				if (files.length >= maxFiles) {
					truncated = true
					return
				}
				files.push(entryPath)
			}
		}
	}
	visit(target)
	return { files, truncated }
}

function trimOutput(value: string): string {
	const trimmed = value.trim()
	return trimmed.length > 4000 ? `${trimmed.slice(0, 4000)}\n[truncated]` : trimmed
}

async function lintPhpFile(
	workspaceRoot: string,
	file: string,
	signal?: AbortSignal,
): Promise<PhpLintResult> {
	return new Promise((resolveResult) => {
		execFile(
			"php",
			["-l", file],
			{
				cwd: workspaceRoot,
				timeout: 10000,
				signal,
				maxBuffer: 1024 * 256,
			},
			(error, stdout, stderr) => {
				const err = error as
					| (Error & { code?: string | number; signal?: string })
					| null
				resolveResult({
					file: relative(workspaceRoot, file) || file,
					ok: !err,
					exitCode: typeof err?.code === "number" ? err.code : undefined,
					stdout: trimOutput(stdout),
					stderr: trimOutput(stderr),
					error: err?.message,
				})
			},
		)
	})
}

const plugin: AgentPlugin = {
	name: "php-lsp",
	manifest: {
		capabilities: ["tools"],
	},

	setup(api, ctx) {
		const workspaceRoot = resolve(ctx.workspaceInfo?.rootPath ?? process.cwd())
		const realWorkspaceRoot = realpathSync(workspaceRoot)

		api.registerTool(
			createTool<PhpDiagnosticsInput, Record<string, unknown>>({
				name: "php_diagnostics",
				description:
					"Run bounded PHP syntax diagnostics with `php -l` for one PHP file or a directory of PHP files in the workspace. Use when reviewing PHP changes or checking PHP parse errors.",
				inputSchema: {
					type: "object",
					properties: {
						target: {
							type: "string",
							description:
								"Workspace-relative or absolute path to a PHP file or directory.",
						},
						maxFiles: {
							type: "integer",
							minimum: 1,
							maximum: 200,
							description:
								"Maximum PHP files to check when target is a directory. Defaults to 50.",
						},
					},
					required: ["target"],
					additionalProperties: false,
				},
				timeoutMs: 30000,
				retryable: false,
				async execute(input, context) {
					const targetInput = input.target?.trim()
					if (!targetInput) {
						return { ok: false, error: "target is required" }
					}

					const targetPath = resolve(workspaceRoot, targetInput)
					if (!isInside(workspaceRoot, targetPath)) {
						return {
							ok: false,
							error: "target must be inside the workspace",
							workspaceRoot,
						}
					}
					if (!existsSync(targetPath)) {
						return { ok: false, error: "target does not exist", target: targetInput }
					}
					const realTargetPath = realpathSync(targetPath)
					if (!isInside(realWorkspaceRoot, realTargetPath)) {
						return {
							ok: false,
							error: "target symlink resolves outside the workspace",
							workspaceRoot,
						}
					}

					const maxFiles = normalizeMaxFiles(input.maxFiles)
					const { files, truncated } = collectPhpFiles(realTargetPath, maxFiles)
					if (files.length === 0) {
						return {
							ok: false,
							target: relative(realWorkspaceRoot, realTargetPath) || realTargetPath,
							checked: 0,
							error: "no .php files found",
						}
					}

					const diagnostics: PhpLintResult[] = []
					for (const file of files) {
						const result = await lintPhpFile(
							realWorkspaceRoot,
							file,
							context.signal,
						)
						if (result.error?.includes("ENOENT")) {
							return {
								ok: false,
								checked: diagnostics.length,
								error:
									"`php` executable was not found. Install PHP or make it available on PATH, then rerun diagnostics.",
							}
						}
						diagnostics.push(result)
					}

					const failed = diagnostics.filter((item) => !item.ok)
					return {
						ok: failed.length === 0,
						target: relative(realWorkspaceRoot, realTargetPath) || realTargetPath,
						checked: diagnostics.length,
						limitApplied: truncated,
						failures: failed.length,
						diagnostics,
					}
				},
			}),
		)
	},
}

export default plugin
