import { spawn } from "node:child_process"
import { existsSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { createTool, type AgentPlugin } from "@cline/sdk"

const PLUGIN_NAME = "oracledb"
const pluginDir = dirname(fileURLToPath(import.meta.url))
const MUTATION_CONFIRMATION = "I approve running this Oracle mutation SQL"

type JsonRecord = Record<string, unknown>

type ToolboxResult = {
	ok: boolean
	tool: string
	stdout: string
	stderr?: string
	exitCode?: number | null
	error?: string
}

const safetyRule = [
	"Oracle Database tools are active. Treat database schemas, query results, execution plans, session data, and storage diagnostics as private user data.",
	"Before running SQL that can mutate data or metadata, including DML, DDL, PL/SQL blocks, grants, session kills, maintenance commands, or writes through stored procedures, explain the target database, affected objects, and expected effect, then wait for explicit approval.",
	"Prefer bounded read-only queries first. Add row limits or filters for exploration, avoid dumping sensitive data, and summarize large result sets.",
	"Never write Oracle passwords, wallet contents, connection strings with secrets, or private keys into chat, committed files, shared logs, or generated scripts. Use environment variables or user-managed secret stores.",
	"Diagnostic tools may require elevated privileges on V$ and DBA_ views. If a permission error occurs, explain the missing privilege instead of suggesting broad DBA access by default.",
].join("\n")

function isRecord(value: unknown): value is JsonRecord {
	return value !== null && typeof value === "object" && !Array.isArray(value)
}

function cleanInput(input: unknown): JsonRecord {
	if (!isRecord(input)) {
		return {}
	}
	const output: JsonRecord = {}
	for (const [key, value] of Object.entries(input)) {
		if (value === undefined || value === null || value === "") {
			continue
		}
		output[key] = value
	}
	return output
}

function missingOracleEnv(): string[] {
	return ["ORACLE_CONNECTION_STRING", "ORACLE_USERNAME", "ORACLE_PASSWORD"].filter(
		(key) => !process.env[key]?.trim(),
	)
}

function localToolboxCommand(): string | undefined {
	const localBin = join(
		pluginDir,
		"node_modules",
		".bin",
		process.platform === "win32" ? "toolbox.cmd" : "toolbox",
	)
	if (existsSync(localBin)) {
		return localBin
	}
	return undefined
}

function truncate(text: string, maxLength = 20000): string {
	if (text.length <= maxLength) {
		return text
	}
	return `${text.slice(0, maxLength)}\n...[truncated ${text.length - maxLength} chars]`
}

function minimalOracleEnv(): NodeJS.ProcessEnv {
	const allowed = [
		"ORACLE_CONNECTION_STRING",
		"ORACLE_USERNAME",
		"ORACLE_PASSWORD",
		"ORACLE_WALLET",
		"ORACLE_USE_OCI",
		"TNS_ADMIN",
		"NLS_LANG",
		"PATH",
		"HOME",
		"USERPROFILE",
		"SystemRoot",
		"TEMP",
		"TMP",
		"LD_LIBRARY_PATH",
		"DYLD_LIBRARY_PATH",
	]
	const env: NodeJS.ProcessEnv = {}
	for (const key of allowed) {
		const value = process.env[key]
		if (value?.trim()) {
			env[key] = value
		}
	}
	return env
}

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function redactSensitive(text: string): string {
	let redacted = text
	for (const key of [
		"ORACLE_PASSWORD",
		"ORACLE_CONNECTION_STRING",
		"ORACLE_USERNAME",
		"ORACLE_WALLET",
	]) {
		const value = process.env[key]
		if (value?.trim()) {
			redacted = redacted.replace(new RegExp(escapeRegExp(value), "g"), `[redacted ${key}]`)
		}
	}
	return redacted
		.replace(/-----BEGIN [^-]+PRIVATE KEY-----[\s\S]*?-----END [^-]+PRIVATE KEY-----/g, "[redacted private key]")
		.replace(/(password\s*[=:]\s*)([^;\s)]+)/gi, "$1[redacted]")
		.replace(/(pwd\s*[=:]\s*)([^;\s)]+)/gi, "$1[redacted]")
}

function safeText(chunks: Buffer[]): string {
	return redactSensitive(truncate(Buffer.concat(chunks).toString("utf8")))
}

function firstSqlKeyword(sql: string): string {
	return sql
		.replace(/^\s*\/\*[\s\S]*?\*\//, "")
		.replace(/^\s*--.*$/m, "")
		.trim()
		.split(/\s+/, 1)[0]
		?.toUpperCase() ?? ""
}

function isReadOnlySql(sql: string): boolean {
	const keyword = firstSqlKeyword(sql)
	if (!["SELECT", "WITH"].includes(keyword)) {
		return false
	}
	return !/\b(INSERT|UPDATE|DELETE|MERGE|DROP|ALTER|CREATE|TRUNCATE|GRANT|REVOKE|CALL|EXEC|EXECUTE|BEGIN|DECLARE|COMMIT|ROLLBACK|ANALYZE|FLASHBACK)\b/i.test(sql)
}

function invokeToolbox(tool: string, input: JsonRecord): Promise<ToolboxResult> {
	const missing = missingOracleEnv()
	if (missing.length > 0) {
		return Promise.resolve({
			ok: false,
			tool,
			stdout: "",
			error: `Missing required Oracle environment variables: ${missing.join(", ")}`,
		})
	}

	const command = localToolboxCommand()
	if (!command) {
		return Promise.resolve({
			ok: false,
			tool,
			stdout: "",
			error: "The Oracle Database Toolbox dependency is not installed. Reinstall this plugin so its package dependencies are installed before using Oracle tools.",
		})
	}

	const env = minimalOracleEnv()
	const args = [
		"--log-level",
		"error",
		"--prebuilt",
		"oracledb",
		"invoke",
		tool,
		"--user-agent-metadata",
		"cline-plugin-oracledb",
		JSON.stringify(input),
	]

	return new Promise((resolve) => {
		const child = spawn(command, args, {
			cwd: pluginDir,
			env,
			shell: process.platform === "win32",
			stdio: ["ignore", "pipe", "pipe"],
		})
		const stdout: Buffer[] = []
		const stderr: Buffer[] = []
		const timeout = setTimeout(() => {
			child.kill()
			resolve({
				ok: false,
				tool,
				stdout: safeText(stdout),
				stderr: safeText(stderr),
				error: "Oracle Database tool timed out after 60 seconds.",
			})
		}, 60000)

		child.stdout?.on("data", (chunk) => stdout.push(Buffer.from(chunk)))
		child.stderr?.on("data", (chunk) => stderr.push(Buffer.from(chunk)))
		child.on("error", (error) => {
			clearTimeout(timeout)
			resolve({
				ok: false,
				tool,
				stdout: safeText(stdout),
				stderr: safeText(stderr),
				error: error.message,
			})
		})
		child.on("close", (exitCode) => {
			clearTimeout(timeout)
			const output = safeText(stdout)
			const errorOutput = safeText(stderr)
			resolve({
				ok: exitCode === 0,
				tool,
				stdout: output,
				...(errorOutput ? { stderr: errorOutput } : {}),
				exitCode,
				...(exitCode === 0 ? {} : { error: `Oracle Database tool exited with ${exitCode}` }),
			})
		})
	})
}

function toolboxTool(
	name: string,
	description: string,
	inputSchema: JsonRecord,
	toolboxName = name.replace(/^oracle_/, ""),
	options: { validate?: (input: JsonRecord) => ToolboxResult | undefined } = {},
) {
	return createTool({
		name,
		description,
		inputSchema,
		timeoutMs: 65000,
		retryable: false,
		async execute(input: unknown) {
			const cleaned = cleanInput(input)
			const validation = options.validate?.(cleaned)
			if (validation) {
				return validation
			}
			return invokeToolbox(toolboxName, cleaned)
		},
	})
}

function schema(properties: JsonRecord, required: string[] = []): JsonRecord {
	return {
		type: "object",
		properties,
		required,
		additionalProperties: false,
	}
}

const plugin: AgentPlugin = {
	name: PLUGIN_NAME,
	manifest: {
		capabilities: ["tools", "skills", "rules"],
	},
	setup(api) {
		api.registerRule({
			id: "oracledb:safety",
			source: PLUGIN_NAME,
			content: safetyRule,
		})

		api.registerTool(
			toolboxTool(
				"oracle_execute_sql",
				"Execute a read-only Oracle SQL SELECT or WITH query. This tool rejects SQL with obvious mutation, DDL, transaction, PL/SQL, grant, or maintenance keywords.",
				schema(
					{
						sql: {
							type: "string",
							description: "Read-only SELECT or WITH SQL statement to execute.",
						},
					},
					["sql"],
				),
				"execute_sql",
				{
					validate(input) {
						const sql = typeof input.sql === "string" ? input.sql : ""
						if (!isReadOnlySql(sql)) {
							return {
								ok: false,
								tool: "execute_sql",
								stdout: "",
								error: "Rejected non-read-only SQL. Use oracle_execute_mutation_sql only after explicit user approval.",
							}
						}
						return undefined
					},
				},
			),
		)
		api.registerTool(
			toolboxTool(
				"oracle_execute_mutation_sql",
				"Execute Oracle SQL with possible side effects after explicit user approval. Use for DML, DDL, PL/SQL, grants, maintenance, or any SQL that can mutate data or metadata.",
				schema(
					{
						sql: {
							type: "string",
							description: "SQL statement to execute.",
						},
						confirmation: {
							type: "string",
							description: `Must exactly equal: ${MUTATION_CONFIRMATION}`,
						},
					},
					["sql", "confirmation"],
				),
				"execute_sql",
				{
					validate(input) {
						if (input.confirmation !== MUTATION_CONFIRMATION) {
							return {
								ok: false,
								tool: "execute_sql",
								stdout: "",
								error: `Missing confirmation. The confirmation field must exactly equal: ${MUTATION_CONFIRMATION}`,
							}
						}
						return undefined
					},
				},
			),
		)
		api.registerTool(
			toolboxTool(
				"oracle_get_query_plan",
				"Generate an Oracle EXPLAIN PLAN for one SQL statement without executing the statement.",
				schema(
					{
						query: {
							type: "string",
							description: "SQL statement to explain. Do not include EXPLAIN PLAN.",
						},
					},
					["query"],
				),
				"get_query_plan",
			),
		)
		api.registerTool(
			toolboxTool(
				"oracle_list_active_sessions",
				"List currently active Oracle database sessions with SID, OS user, program, and SQL text when privileges allow it.",
				schema({}),
				"list_active_sessions",
			),
		)
		api.registerTool(
			toolboxTool(
				"oracle_list_invalid_objects",
				"List invalid Oracle database objects that may need recompilation.",
				schema({}),
				"list_invalid_objects",
			),
		)
		api.registerTool(
			toolboxTool(
				"oracle_list_tables",
				"List tables in the connected Oracle schema, optionally filtered by comma-separated table names.",
				schema({
						names: {
							type: "string",
							description: "Optional comma-separated table names to filter.",
						},
					}),
				"list_tables",
			),
		)
		api.registerTool(
			toolboxTool(
				"oracle_list_tablespace_usage",
				"List Oracle tablespace total size, free space, and used percentage for storage diagnostics.",
				schema({}),
				"list_tablespace_usage",
			),
		)
		api.registerTool(
			toolboxTool(
				"oracle_list_top_sql_by_resource",
				"List top Oracle SQL statements by resource use when database privileges allow library-cache diagnostics.",
				schema({
						metric: {
							type: "string",
							enum: ["CPU", "IO", "ELAPSED"],
							description: "Optional resource metric such as CPU, IO, or ELAPSED.",
						},
						limit: {
							type: "integer",
							minimum: 1,
							maximum: 50,
							description: "Optional maximum number of statements.",
						},
					}),
				"list_top_sql_by_resource",
			),
		)
	},
}

export default plugin
