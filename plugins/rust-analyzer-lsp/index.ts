import { execFile } from "node:child_process"
import { existsSync, realpathSync, statSync } from "node:fs"
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from "node:path"
import { promisify } from "node:util"
import { type AgentPlugin, createTool } from "@cline/core"

const execFileAsync = promisify(execFile)
const MAX_OUTPUT_BYTES = 8 * 1024 * 1024
const MAX_DIAGNOSTICS = 80
const MAX_RENDERED_CHARS = 32_000
const TIMEOUT_MS = 120_000

type RustDiagnosticsInput = {
	path?: string
	package?: string
	features?: string[]
	noDefaultFeatures?: boolean
	allTargets?: boolean
}

type CargoMessage = {
	reason?: string
	package_id?: string
	target?: { name?: string; kind?: string[] }
	message?: {
		level?: string
		message?: string
		code?: { code?: string; explanation?: string | null }
		spans?: Array<{
			file_name?: string
			line_start?: number
			line_end?: number
			column_start?: number
			column_end?: number
			is_primary?: boolean
			label?: string | null
		}>
		rendered?: string
	}
}

type CommandError = Error & {
	code?: string | number
	stdout?: string | Buffer
	stderr?: string | Buffer
	signal?: string
}

type RustDiagnostic = {
	level?: string
	message?: string
	code?: string
	packageId?: string
	target?: string
	targetKind?: string[]
	file?: string
	line?: number
	column?: number
	endLine?: number
	endColumn?: number
	label?: string
	rendered?: string
}

function toText(value: string | Buffer | undefined): string {
	return Buffer.isBuffer(value) ? value.toString("utf8") : value ?? ""
}

function isInsideWorkspace(workspaceRoot: string, target: string) {
	const rel = relative(workspaceRoot, target)
	return rel === "" || (rel !== ".." && !rel.startsWith(`..${sep}`) && !isAbsolute(rel))
}

function isFile(path: string) {
	try {
		return statSync(path).isFile()
	} catch {
		return false
	}
}

function isDirectory(path: string) {
	try {
		return statSync(path).isDirectory()
	} catch {
		return false
	}
}

function findCargoToml(startPath: string) {
	let dir = isDirectory(startPath) ? startPath : dirname(startPath)
	while (true) {
		const candidate = join(dir, "Cargo.toml")
		if (isFile(candidate)) return candidate
		const parent = dirname(dir)
		if (parent === dir) return undefined
		dir = parent
	}
}

function resolveCargoManifest(workspaceRoot: string, inputPath: unknown) {
	const rawPath = typeof inputPath === "string" && inputPath.trim() ? inputPath.trim() : "."
	const candidate = isAbsolute(rawPath) ? resolve(rawPath) : resolve(workspaceRoot, rawPath)

	if (!existsSync(candidate)) {
		return { ok: false as const, error: `Path does not exist: ${candidate}` }
	}

	let realWorkspace: string
	let realCandidate: string
	try {
		realWorkspace = realpathSync(workspaceRoot)
		realCandidate = realpathSync(candidate)
	} catch (error) {
		return {
			ok: false as const,
			error: error instanceof Error ? error.message : String(error),
		}
	}

	if (!isInsideWorkspace(realWorkspace, realCandidate)) {
		return { ok: false as const, error: "Path must stay inside the workspace." }
	}

	const manifestPath = basename(realCandidate) === "Cargo.toml"
		? realCandidate
		: findCargoToml(realCandidate)

	if (!manifestPath) {
		return {
			ok: false as const,
			error:
				"No Cargo.toml found. Pass a Rust file, crate directory, or Cargo.toml inside the workspace.",
		}
	}

	let manifest: string
	try {
		manifest = realpathSync(manifestPath)
	} catch (error) {
		return {
			ok: false as const,
			error: error instanceof Error ? error.message : String(error),
		}
	}

	if (!isInsideWorkspace(realWorkspace, manifest)) {
		return { ok: false as const, error: "Cargo.toml must stay inside the workspace." }
	}

	return {
		ok: true as const,
		manifest,
		manifestDir: dirname(manifest),
		realWorkspace,
		displayPath: relative(realWorkspace, manifest).split(sep).join("/"),
	}
}

function normalizeFeature(value: unknown) {
	return typeof value === "string" ? value.trim() : ""
}

function cargoArgs(manifestPath: string, input: RustDiagnosticsInput) {
	const args = [
		"check",
		"--message-format=json",
		"--manifest-path",
		manifestPath,
		"--locked",
		"--offline",
	]

	if (input.allTargets !== false) args.push("--all-targets")

	if (typeof input.package === "string" && input.package.trim()) {
		args.push("--package", input.package.trim())
	}

	const features = Array.isArray(input.features)
		? input.features.map(normalizeFeature).filter(Boolean)
		: []
	if (features.length > 0) {
		args.push("--features", features.join(","))
	}

	if (input.noDefaultFeatures === true) args.push("--no-default-features")

	return args
}

function normalizeDiagnosticFile(
	fileName: string | undefined,
	realWorkspace: string,
	manifestDir: string,
) {
	if (!fileName) return undefined
	const candidates = isAbsolute(fileName)
		? [resolve(fileName)]
		: [resolve(manifestDir, fileName), resolve(realWorkspace, fileName)]

	for (const candidate of candidates) {
		try {
			const real = existsSync(candidate) ? realpathSync(candidate) : candidate
			if (!isInsideWorkspace(realWorkspace, real)) continue
			if (!existsSync(candidate) && candidate !== candidates[candidates.length - 1]) continue
			return relative(realWorkspace, real).split(sep).join("/")
		} catch {
			continue
		}
	}

	return undefined
}

function parseCargoDiagnostics(
	stdout: string,
	realWorkspace: string,
	manifestDir: string,
) {
	const diagnostics: RustDiagnostic[] = []
	let totalDiagnostics = 0
	let renderedChars = 0

	for (const line of stdout.split(/\r?\n/)) {
		if (!line.trim()) continue

		let message: CargoMessage
		try {
			message = JSON.parse(line) as CargoMessage
		} catch {
			continue
		}

		if (message.reason !== "compiler-message" || !message.message) continue
		totalDiagnostics += 1

		if (diagnostics.length >= MAX_DIAGNOSTICS) continue

		const primary =
			message.message.spans?.find((span) => span.is_primary) ??
			message.message.spans?.[0]
		const rendered = message.message.rendered ?? undefined
		const remainingRendered = MAX_RENDERED_CHARS - renderedChars
		const renderedSlice =
			rendered && remainingRendered > 0
				? rendered.slice(0, Math.min(4000, remainingRendered))
				: undefined
		if (renderedSlice) renderedChars += renderedSlice.length

		diagnostics.push({
			level: message.message.level,
			message: message.message.message,
			code: message.message.code?.code,
			packageId: message.package_id,
			target: message.target?.name,
			targetKind: message.target?.kind,
			file: normalizeDiagnosticFile(primary?.file_name, realWorkspace, manifestDir),
			line: primary?.line_start,
			column: primary?.column_start,
			endLine: primary?.line_end,
			endColumn: primary?.column_end,
			label: primary?.label ?? undefined,
			rendered: renderedSlice,
		})
	}

	return {
		diagnostics,
		totalDiagnostics,
		truncated:
			totalDiagnostics > diagnostics.length ||
			renderedChars >= MAX_RENDERED_CHARS,
		omittedDiagnostics: Math.max(0, totalDiagnostics - diagnostics.length),
	}
}

async function runCargoCheck(args: string[], cwd: string) {
	try {
		const result = await execFileAsync("cargo", args, {
			cwd,
			timeout: TIMEOUT_MS,
			maxBuffer: MAX_OUTPUT_BYTES,
		})
		return { exitCode: 0, stdout: result.stdout, stderr: result.stderr }
	} catch (error) {
		const commandError = error as CommandError
		if (commandError.code === "ENOENT") {
			return {
				missingDependency: true,
				error: "`cargo` was not found on PATH. Install Rust with rustup or your system package manager.",
			}
		}

		return {
			exitCode: typeof commandError.code === "number" ? commandError.code : 1,
			toolFailure: typeof commandError.code !== "number",
			error: typeof commandError.code === "number" ? undefined : commandError.message,
			stdout: toText(commandError.stdout),
			stderr: toText(commandError.stderr) || commandError.message,
			signal: commandError.signal,
		}
	}
}

const plugin: AgentPlugin = {
	name: "rust-analyzer-lsp",
	manifest: {
		capabilities: ["tools"],
	},

	setup(api, ctx) {
		const workspaceRoot = resolve(ctx.workspaceInfo?.rootPath ?? process.cwd())

		api.registerTool(
			createTool({
				name: "rust_diagnostics",
				description:
					"Run bounded Rust diagnostics for a Cargo project inside the workspace using local `cargo check --message-format=json`. Always passes --offline and --locked.",
				inputSchema: {
					type: "object",
					properties: {
						path: {
							type: "string",
							description:
								"Workspace-relative Rust file, crate directory, or Cargo.toml. Defaults to the workspace root.",
						},
						package: {
							type: "string",
							description: "Optional Cargo package name for workspace checks.",
						},
						features: {
							type: "array",
							items: { type: "string" },
							description: "Optional Cargo features to enable.",
						},
						noDefaultFeatures: {
							type: "boolean",
							description: "Pass --no-default-features.",
						},
						allTargets: {
							type: "boolean",
							description: "Pass --all-targets. Defaults to true.",
						},
					},
					additionalProperties: false,
				},
				timeoutMs: TIMEOUT_MS + 5000,
				retryable: false,
				async execute(input: unknown) {
					const options = (input && typeof input === "object" ? input : {}) as RustDiagnosticsInput
					const resolved = resolveCargoManifest(workspaceRoot, options.path)

					if (!resolved.ok) {
						return { ok: false, error: resolved.error }
					}

					if (options.features !== undefined && !Array.isArray(options.features)) {
						return { ok: false, error: "features must be an array of strings." }
					}

					const args = cargoArgs(resolved.manifest, options)
					const result = await runCargoCheck(args, resolved.realWorkspace)

					if (result.toolFailure) {
						return {
							ok: false,
							error: result.error ?? "Failed to run cargo diagnostics.",
							stderr: result.stderr?.trim().slice(0, 12000) || undefined,
							signal: result.signal,
						}
					}

					if (result.missingDependency) {
						return {
							ok: false,
							missingDependency: "cargo",
							error: result.error,
						}
					}

					const parsed = parseCargoDiagnostics(
						result.stdout ?? "",
						resolved.realWorkspace,
						resolved.manifestDir,
					)

					return {
						ok: true,
						checkPassed: result.exitCode === 0,
						exitCode: result.exitCode,
						manifest: resolved.displayPath,
						command: "cargo",
						args,
						diagnosticCount: parsed.diagnostics.length,
						totalDiagnostics: parsed.totalDiagnostics,
						omittedDiagnostics: parsed.omittedDiagnostics,
						truncated: parsed.truncated,
						diagnostics: parsed.diagnostics,
						stderr: result.stderr?.trim().slice(0, 12000) || undefined,
						signal: result.signal,
					}
				},
			}),
		)
	},
}

export default plugin
