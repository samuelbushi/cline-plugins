import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process"
import { existsSync, readFileSync, realpathSync } from "node:fs"
import { dirname, isAbsolute, join, relative, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import type { AgentPlugin } from "@cline/sdk"

type SwiftGotoDefinitionInput = {
	file?: string
	line?: number
	column?: number
}

type LspResponse<T = unknown> = {
	id?: number
	result?: T
	error?: { code?: number; message?: string }
}

type LspRange = {
	start: { line: number; character: number }
	end?: { line: number; character: number }
}

type LspLocation = {
	uri: string
	range: LspRange
}

type LspLocationLink = {
	targetUri: string
	targetSelectionRange?: LspRange
	targetRange?: LspRange
}

type DefinitionTarget = {
	file: string
	line: number
	column: number
}

const SWIFT_KEYWORDS = new Set([
	"associatedtype",
	"break",
	"case",
	"catch",
	"class",
	"continue",
	"default",
	"defer",
	"deinit",
	"do",
	"else",
	"enum",
	"extension",
	"fallthrough",
	"false",
	"fileprivate",
	"for",
	"func",
	"guard",
	"if",
	"import",
	"in",
	"init",
	"inout",
	"internal",
	"is",
	"let",
	"nil",
	"open",
	"operator",
	"private",
	"protocol",
	"public",
	"repeat",
	"return",
	"self",
	"static",
	"struct",
	"subscript",
	"super",
	"switch",
	"throw",
	"throws",
	"true",
	"try",
	"typealias",
	"var",
	"where",
	"while",
])

const MAX_IDENTIFIER_LOOKUPS = 5
let sessionWorkspaceRoot: string | undefined

function asObject(value: unknown): Record<string, unknown> {
	return value && typeof value === "object"
		? (value as Record<string, unknown>)
		: {}
}

function asPositiveInteger(value: unknown): number | undefined {
	return typeof value === "number" && Number.isInteger(value) && value > 0
		? value
		: undefined
}

function isInsidePath(parent: string, child: string): boolean {
	const rel = relative(parent, child)
	return rel === "" || (!rel.startsWith("..") && !isAbsolute(rel))
}

function findProjectRoot(startDir: string, boundary?: string): string {
	let dir = startDir
	while (true) {
		if (existsSync(join(dir, "Package.swift")) || existsSync(join(dir, ".git"))) {
			return dir
		}
		if (boundary && dir === boundary) {
			return boundary
		}
		const parent = dirname(dir)
		if (parent === dir) {
			return boundary ?? startDir
		}
		dir = parent
	}
}

function findIdentifiersOnLine(text: string, line: number) {
	const lines = text.split(/\r?\n/)
	const content = lines[line - 1]
	if (content === undefined) {
		return []
	}

	const identifiers: Array<{ symbol: string; character: number }> = []
	const seen = new Set<string>()
	const matcher = /\b[A-Za-z_][A-Za-z0-9_]*\b/g
	for (const match of content.matchAll(matcher)) {
		const symbol = match[0]
		if (SWIFT_KEYWORDS.has(symbol) || seen.has(symbol)) {
			continue
		}
		seen.add(symbol)
		const index = match.index ?? 0
		identifiers.push({
			symbol,
			character: index + Math.min(1, Math.max(0, symbol.length - 1)),
		})
		if (identifiers.length >= MAX_IDENTIFIER_LOOKUPS) {
			break
		}
	}
	return identifiers
}

function normalizeDefinitionTarget(
	location: LspLocation | LspLocationLink,
): DefinitionTarget | undefined {
	const uri = "uri" in location ? location.uri : location.targetUri
	const range =
		"range" in location
			? location.range
			: (location.targetSelectionRange ?? location.targetRange)
	if (!uri || !range?.start) {
		return undefined
	}

	let file: string
	try {
		file = fileURLToPath(uri)
	} catch {
		return undefined
	}

	return {
		file,
		line: range.start.line + 1,
		column: range.start.character + 1,
	}
}

function normalizeDefinitionResult(result: unknown): DefinitionTarget[] {
	const locations = Array.isArray(result)
		? result
		: result && typeof result === "object"
			? [result]
			: []
	return locations
		.map((location) =>
			normalizeDefinitionTarget(location as LspLocation | LspLocationLink),
		)
		.filter((target): target is DefinitionTarget => !!target)
}

class SwiftLspClient {
	private child: ChildProcessWithoutNullStreams
	private nextId = 1
	private buffer = Buffer.alloc(0)
	private stderr = ""
	private pending = new Map<
		number,
		{
			resolve: (value: unknown) => void
			reject: (error: Error) => void
			timer: ReturnType<typeof setTimeout>
		}
	>()

	constructor(
		private readonly projectRoot: string,
		private readonly command = process.env.SOURCEKIT_LSP || "sourcekit-lsp",
	) {
		this.child = spawn(this.command, [], {
			cwd: this.projectRoot,
			env: process.env,
			stdio: ["pipe", "pipe", "pipe"],
		})

		this.child.stdout.on("data", (chunk: Buffer) => this.onStdout(chunk))
		this.child.stderr.on("data", (chunk: Buffer) => {
			this.stderr = `${this.stderr}${chunk.toString("utf8")}`.slice(-4000)
		})
		this.child.on("error", (error) => this.rejectAll(error))
		this.child.on("close", (code, signal) => {
			this.rejectAll(
				new Error(
					`${this.command} exited before responding (code ${code ?? "null"}, signal ${signal ?? "null"})${this.stderr ? `: ${this.stderr.trim()}` : ""}`,
				),
			)
		})
	}

	async initialize() {
		await this.request(
			"initialize",
			{
				processId: process.pid,
				rootUri: pathToFileURL(this.projectRoot).toString(),
				capabilities: {},
				clientInfo: { name: "cline-swift-lsp" },
				workspaceFolders: [
					{
						uri: pathToFileURL(this.projectRoot).toString(),
						name: "workspace",
					},
				],
			},
			7_000,
		)
		this.notify("initialized", {})
	}

	openSwiftFile(file: string, text: string) {
		this.notify("textDocument/didOpen", {
			textDocument: {
				uri: pathToFileURL(file).toString(),
				languageId: "swift",
				version: 1,
				text,
			},
		})
	}

	definition(file: string, line: number, character: number) {
		return this.request(
			"textDocument/definition",
			{
				textDocument: { uri: pathToFileURL(file).toString() },
				position: { line: line - 1, character },
			},
			3_000,
		)
	}

	async dispose() {
		try {
			await this.request("shutdown", null, 1000)
			this.notify("exit", null)
		} catch {
			this.child.kill()
		}
	}

	private request(method: string, params: unknown, timeoutMs: number) {
		const id = this.nextId++
		const message = { jsonrpc: "2.0", id, method, params }
		return new Promise<unknown>((resolve, reject) => {
			const timer = setTimeout(() => {
				this.pending.delete(id)
				reject(new Error(`${method} timed out after ${timeoutMs}ms`))
			}, timeoutMs)
			this.pending.set(id, { resolve, reject, timer })
			try {
				this.send(message)
			} catch (error) {
				clearTimeout(timer)
				this.pending.delete(id)
				reject(error instanceof Error ? error : new Error(String(error)))
			}
		})
	}

	private notify(method: string, params: unknown) {
		this.send({ jsonrpc: "2.0", method, params })
	}

	private send(message: unknown) {
		const body = JSON.stringify(message)
		this.child.stdin.write(
			`Content-Length: ${Buffer.byteLength(body, "utf8")}\r\n\r\n${body}`,
			"utf8",
		)
	}

	private onStdout(chunk: Buffer) {
		this.buffer = Buffer.concat([this.buffer, chunk])
		while (true) {
			const headerEnd = this.buffer.indexOf("\r\n\r\n")
			if (headerEnd < 0) {
				return
			}
			const header = this.buffer.slice(0, headerEnd).toString("utf8")
			const match = header.match(/Content-Length:\s*(\d+)/i)
			if (!match) {
				this.buffer = this.buffer.slice(headerEnd + 4)
				continue
			}
			const length = Number(match[1])
			const bodyStart = headerEnd + 4
			const bodyEnd = bodyStart + length
			if (this.buffer.length < bodyEnd) {
				return
			}
			const body = this.buffer.slice(bodyStart, bodyEnd).toString("utf8")
			this.buffer = this.buffer.slice(bodyEnd)
			this.handleMessage(body)
		}
	}

	private handleMessage(body: string) {
		let response: LspResponse
		try {
			response = JSON.parse(body) as LspResponse
		} catch {
			return
		}
		if (typeof response.id !== "number") {
			return
		}
		const pending = this.pending.get(response.id)
		if (!pending) {
			return
		}
		clearTimeout(pending.timer)
		this.pending.delete(response.id)
		if (response.error) {
			pending.reject(
				new Error(response.error.message ?? `LSP error ${response.error.code}`),
			)
			return
		}
		pending.resolve(response.result)
	}

	private rejectAll(error: Error) {
		for (const [id, pending] of this.pending) {
			clearTimeout(pending.timer)
			pending.reject(error)
			this.pending.delete(id)
		}
	}
}

async function resolveSwiftDefinitions(input: SwiftGotoDefinitionInput) {
	const fileInput = typeof input.file === "string" ? input.file.trim() : ""
	const line = asPositiveInteger(input.line)
	const explicitColumn = asPositiveInteger(input.column)

	if (!fileInput) {
		return { error: "swift_goto_definition requires a file path." }
	}
	if (!line) {
		return { error: "swift_goto_definition requires a 1-based line number." }
	}

	let workspaceRoot: string | undefined
	if (sessionWorkspaceRoot) {
		try {
			workspaceRoot = realpathSync(sessionWorkspaceRoot)
		} catch {}
	}

	const candidateFile = isAbsolute(fileInput)
		? fileInput
		: resolve(workspaceRoot ?? process.cwd(), fileInput)
	const file = existsSync(candidateFile)
		? realpathSync(candidateFile)
		: resolve(candidateFile)

	if (!existsSync(file)) {
		return { error: `File does not exist: ${file}` }
	}
	if (workspaceRoot && !isInsidePath(workspaceRoot, file)) {
		return {
			error: `File is outside the active Cline workspace: ${file}`,
			workspaceRoot,
		}
	}
	if (!file.endsWith(".swift")) {
		return { error: `Expected a .swift file: ${file}` }
	}

	const text = readFileSync(file, "utf8")
	const positions = explicitColumn
		? [{ symbol: "<position>", character: explicitColumn - 1 }]
		: findIdentifiersOnLine(text, line)

	if (positions.length === 0) {
		return {
			found: false,
			file,
			line,
			message: "No Swift identifiers found on this line.",
		}
	}

	const projectRoot = findProjectRoot(dirname(file), workspaceRoot)
	const client = new SwiftLspClient(projectRoot)
	try {
		await client.initialize()
		client.openSwiftFile(file, text)

		const results: Array<{ symbol: string; definitions: DefinitionTarget[] }> =
			[]
		const seen = new Set<string>()
		for (const position of positions) {
			const definitionResult = await client.definition(
				file,
				line,
				position.character,
			)
			const definitions = normalizeDefinitionResult(definitionResult).filter(
				(target) => !(target.file === file && target.line === line),
			)
			const uniqueDefinitions = definitions.filter((target) => {
				const key = `${target.file}:${target.line}:${target.column}`
				if (seen.has(key)) {
					return false
				}
				seen.add(key)
				return true
			})
			if (uniqueDefinitions.length > 0) {
				results.push({
					symbol: position.symbol,
					definitions: uniqueDefinitions,
				})
			}
		}

		if (results.length === 0) {
			return {
				found: false,
				query: { file, line, column: explicitColumn },
				projectRoot,
				message:
					"Swift identifiers were found, but SourceKit-LSP did not return external definitions.",
			}
		}

		return {
			found: true,
			query: { file, line, column: explicitColumn },
			projectRoot,
			results,
		}
	} catch (error) {
		return {
			error:
				error instanceof Error
					? error.message
					: `SourceKit-LSP failed: ${String(error)}`,
			hint: "Install the Swift toolchain and ensure sourcekit-lsp is on PATH, or set SOURCEKIT_LSP to its full path.",
		}
	} finally {
		await client.dispose()
	}
}

const plugin: AgentPlugin = {
	name: "swift-lsp",
	manifest: {
		capabilities: ["tools"],
	},

	setup(api, ctx) {
		sessionWorkspaceRoot = ctx.workspaceInfo?.rootPath
		api.registerTool({
			name: "swift_goto_definition",
			description:
				"Find Swift symbol definitions using SourceKit-LSP. Given a .swift file and 1-based line number, resolves identifiers on that line. Provide column for a specific position.",
			inputSchema: {
				type: "object",
				properties: {
					file: {
						type: "string",
						description: "Absolute or workspace-relative path to a .swift file.",
					},
					line: {
						type: "integer",
						description: "Line number, 1-based.",
					},
					column: {
						type: "integer",
						description:
							"Optional column number, 1-based. If omitted, all identifiers on the line are checked.",
					},
				},
				required: ["file", "line"],
				additionalProperties: false,
			},
			timeoutMs: 30_000,
			retryable: false,
			async execute(input: unknown) {
				return resolveSwiftDefinitions(asObject(input) as SwiftGotoDefinitionInput)
			},
		})
	},
}

export { plugin, resolveSwiftDefinitions }
export default plugin
