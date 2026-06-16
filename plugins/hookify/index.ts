import {
	existsSync,
	mkdirSync,
	readFileSync,
	readdirSync,
	unlinkSync,
	writeFileSync,
} from "node:fs"
import { basename, join, resolve } from "node:path"
import { type AgentPlugin } from "@cline/core"

type HookifyEvent = "bash" | "file" | "all"
type HookifyAction = "block"

type Condition = {
	field: string
	operator: string
	pattern: string
}

type Rule = {
	name: string
	enabled: boolean
	event: HookifyEvent
	action?: HookifyAction
	pattern?: string
	field?: string
	conditions: Condition[]
	message: string
	path: string
}

type EvaluationContext = {
	event: HookifyEvent
	fields: Record<string, string>
}

let workspaceRoot = process.cwd()

function rulesDir(): string {
	return join(workspaceRoot, ".cline")
}

function ruleFilePattern(name: string): string {
	return `hookify.${name}.local.md`
}

function slugify(input: string): string {
	const slug = input
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
	return slug || "rule"
}

function parseScalar(value: string): string | boolean {
	const trimmed = value.trim().replace(/^["']|["']$/g, "")
	if (trimmed === "true") return true
	if (trimmed === "false") return false
	return trimmed
}

function parseKeyValue(line: string): [string, string | boolean] | undefined {
	const index = line.indexOf(":")
	if (index < 0) return undefined
	const key = line.slice(0, index).trim()
	const value = line.slice(index + 1)
	if (!key) return undefined
	return [key, parseScalar(value)]
}

function extractFrontmatter(content: string): {
	frontmatter: Record<string, unknown>
	message: string
} {
	if (!content.startsWith("---")) {
		return { frontmatter: {}, message: content.trim() }
	}

	const end = content.indexOf("\n---", 3)
	if (end < 0) {
		return { frontmatter: {}, message: content.trim() }
	}

	const frontmatterText = content.slice(3, end)
	const message = content.slice(end + 4).trim()
	const frontmatter: Record<string, unknown> = {}
	let currentListKey: string | undefined
	let currentCondition: Record<string, unknown> | undefined

	for (const rawLine of frontmatterText.split(/\r?\n/)) {
		if (!rawLine.trim() || rawLine.trim().startsWith("#")) continue
		const trimmed = rawLine.trim()
		if (trimmed === "conditions:") {
			currentListKey = "conditions"
			frontmatter.conditions = []
			currentCondition = undefined
			continue
		}
		if (currentListKey === "conditions" && trimmed.startsWith("- ")) {
			currentCondition = {}
			const conditions = frontmatter.conditions as Record<string, unknown>[]
			conditions.push(currentCondition)
			const entry = parseKeyValue(trimmed.slice(2))
			if (entry) currentCondition[entry[0]] = entry[1]
			continue
		}
		if (currentListKey === "conditions" && currentCondition && /^\s+/.test(rawLine)) {
			const entry = parseKeyValue(trimmed)
			if (entry) currentCondition[entry[0]] = entry[1]
			continue
		}

		currentListKey = undefined
		currentCondition = undefined
		const entry = parseKeyValue(rawLine)
		if (entry) frontmatter[entry[0]] = entry[1]
	}

	return { frontmatter, message }
}

function asString(value: unknown): string | undefined {
	return typeof value === "string" && value.trim() ? value.trim() : undefined
}

function normalizeEvent(value: unknown): HookifyEvent | undefined {
	const event = asString(value)
	if (event === undefined) return "all"
	if (event === "bash" || event === "file" || event === "all") return event
	return undefined
}

function parseCreateEvent(value: string): HookifyEvent | undefined {
	if (value === "bash" || value === "file" || value === "all") return value
	return undefined
}

function normalizeAction(value: unknown): HookifyAction | undefined {
	const action = asString(value)
	if (action === undefined || action === "block") return "block"
	return undefined
}

function parseRuleFile(path: string): Rule | undefined {
	const { frontmatter, message } = extractFrontmatter(readFileSync(path, "utf8"))
	const name = asString(frontmatter.name) ?? slugify(basename(path))
	const event = normalizeEvent(frontmatter.event)
	if (!event) return undefined
	const conditions = Array.isArray(frontmatter.conditions)
		? frontmatter.conditions
				.filter((condition): condition is Record<string, unknown> =>
					Boolean(condition && typeof condition === "object" && !Array.isArray(condition)),
				)
				.map((condition) => ({
					field: asString(condition.field) ?? "",
					operator: asString(condition.operator) ?? "regex_match",
					pattern: asString(condition.pattern) ?? "",
				}))
				.filter((condition) => condition.field && condition.pattern)
		: []

	return {
		name,
		enabled: frontmatter.enabled !== false,
		event,
		action: normalizeAction(frontmatter.action),
		pattern: asString(frontmatter.pattern),
		field: asString(frontmatter.field),
		conditions,
		message,
		path,
	}
}

function loadRules(): Rule[] {
	const dir = rulesDir()
	if (!existsSync(dir)) return []

	return readdirSync(dir)
		.filter((name) => /^hookify\..*\.local\.md$/.test(name))
		.map((name) => join(dir, name))
		.flatMap((path) => {
			try {
				const rule = parseRuleFile(path)
				return rule ? [rule] : []
			} catch {
				return []
			}
		})
}

function regexMatches(pattern: string, value: string): boolean {
	try {
		return new RegExp(pattern, "i").test(value)
	} catch {
		return false
	}
}

function conditionMatches(condition: Condition, fields: Record<string, string>): boolean {
	const value = fields[condition.field] ?? ""
	switch (condition.operator) {
		case "contains":
			return value.includes(condition.pattern)
		case "equals":
			return value === condition.pattern
		case "not_contains":
			return !value.includes(condition.pattern)
		case "starts_with":
			return value.startsWith(condition.pattern)
		case "ends_with":
			return value.endsWith(condition.pattern)
		case "regex_match":
		default:
			return regexMatches(condition.pattern, value)
	}
}

function ruleMatches(rule: Rule, context: EvaluationContext): boolean {
	if (!rule.enabled || rule.action !== "block") return false
	if (rule.event !== "all" && rule.event !== context.event) return false
	if (rule.conditions.length > 0) {
		return rule.conditions.every((condition) =>
			conditionMatches(condition, context.fields),
		)
	}
	if (!rule.pattern) return false
	if (!rule.field && context.event === "file") {
		return ["file_path", "path", "new_text", "content"].some((field) =>
			conditionMatches(
				{ field, operator: "regex_match", pattern: rule.pattern ?? "" },
				context.fields,
			),
		)
	}
	const field = rule.field ?? (context.event === "bash" ? "command" : "content")
	return conditionMatches(
		{ field, operator: "regex_match", pattern: rule.pattern },
		context.fields,
	)
}

function stringifyCommand(value: unknown): string {
	if (typeof value === "string") return value
	if (Array.isArray(value)) return value.map(stringifyCommand).join("\n")
	if (value && typeof value === "object") {
		const record = value as Record<string, unknown>
		const command = asString(record.command) ?? asString(record.cmd)
		const args = Array.isArray(record.args) ? record.args.map(String).join(" ") : ""
		return [command, args].filter(Boolean).join(" ")
	}
	return ""
}

function commandText(input: unknown): string {
	if (typeof input === "string" || Array.isArray(input)) return stringifyCommand(input)
	if (!input || typeof input !== "object") return ""
	const record = input as Record<string, unknown>
	return stringifyCommand(record.commands ?? record.command ?? record.cmd ?? input)
}

function stringField(record: Record<string, unknown>, key: string): string {
	const value = record[key]
	return typeof value === "string" ? value : ""
}

function extractApplyPatchPaths(patch: string): string[] {
	const paths: string[] = []
	const headers = [
		"*** Add File: ",
		"*** Update File: ",
		"*** Delete File: ",
		"*** Move to: ",
	]

	for (const line of patch.split(/\r?\n/)) {
		for (const header of headers) {
			if (line.startsWith(header)) {
				const filePath = line.slice(header.length).trim()
				if (filePath) paths.push(filePath)
				break
			}
		}
	}

	return paths
}

function buildEvaluationContext(toolName: string, input: unknown): EvaluationContext | undefined {
	if (toolName === "run_commands") {
		const command = commandText(input)
		return {
			event: "bash",
			fields: {
				command,
				content: command,
			},
		}
	}

	if (toolName === "editor") {
		const record =
			input && typeof input === "object" && !Array.isArray(input)
				? (input as Record<string, unknown>)
				: {}
		return {
			event: "file",
			fields: {
				file_path: stringField(record, "path"),
				path: stringField(record, "path"),
				old_text: stringField(record, "old_text"),
				new_text: stringField(record, "new_text"),
				content: [stringField(record, "old_text"), stringField(record, "new_text")]
					.filter(Boolean)
					.join("\n"),
			},
		}
	}

	if (toolName === "apply_patch") {
		const patch =
			typeof input === "string"
				? input
				: input && typeof input === "object" && !Array.isArray(input)
					? stringField(input as Record<string, unknown>, "input")
					: ""
		const paths = extractApplyPatchPaths(patch).join("\n")
		return {
			event: "file",
			fields: {
				file_path: paths,
				path: paths,
				new_text: patch,
				content: [paths, patch].filter(Boolean).join("\n"),
			},
		}
	}

	return undefined
}

function formatBlockMessage(matches: Rule[]): string {
	return [
		"Hookify blocked this tool call.",
		...matches.map((rule) =>
			[`Rule: ${rule.name}`, rule.message || "This operation matched a Hookify block rule."].join(
				"\n",
			),
		),
	].join("\n\n")
}

function usage(): string {
	return [
		"Hookify manages workspace-local block rules in `.cline/hookify.*.local.md`.",
		"",
		"Create a rule:",
		"/hookify <name> | <bash|file|all> | <regex> | <message>",
		"",
		"Examples:",
		"/hookify block-dangerous-rm | bash | rm\\s+-rf | Destructive rm command blocked. Use a safer command.",
		"/hookify block-env-edits | file | \\.env$ | Edits touching environment files are blocked.",
		"",
		"List rules:",
		"/hookify:list",
		"",
		"Configure rules:",
		"/hookify:configure enable <name>",
		"/hookify:configure disable <name>",
		"/hookify:configure delete <name>",
	].join("\n")
}

function createRule(input: string): string {
	const parts = input.split("|").map((part) => part.trim())
	if (parts.length < 4 || parts.some((part) => !part)) return usage()

	const [rawName, rawEvent, pattern, ...messageParts] = parts
	const name = slugify(rawName)
	const event = parseCreateEvent(rawEvent)
	if (!event) {
		return `Invalid event "${rawEvent}". Use one of: bash, file, all.\n\n${usage()}`
	}
	const message = messageParts.join(" | ").trim()
	const dir = rulesDir()
	const path = join(dir, ruleFilePattern(name))

	mkdirSync(dir, { recursive: true })
	writeFileSync(
		path,
		[
			"---",
			`name: ${name}`,
			"enabled: true",
			`event: ${event}`,
			"action: block",
			`pattern: ${pattern}`,
			"---",
			"",
			message,
			"",
		].join("\n"),
		"utf8",
	)

	return `Created Hookify rule ${name} at ${path}. It blocks matching ${event} tool calls immediately.`
}

function listRules(): string {
	const rules = loadRules()
	if (rules.length === 0) {
		return "No Hookify rules found. Create one with `/hookify <name> | <bash|file|all> | <regex> | <message>`."
	}

	return [
		"| Name | Enabled | Event | Action | Pattern | File |",
		"| --- | --- | --- | --- | --- | --- |",
		...rules.map((rule) =>
			[
					rule.name,
					rule.enabled ? "yes" : "no",
					rule.event,
					rule.action ?? "ignored",
					rule.pattern ?? `${rule.conditions.length} condition(s)`,
					basename(rule.path),
				]
				.map((value) => String(value).replace(/\|/g, "\\|"))
				.join(" | "),
		),
	]
		.map((line) => (line.startsWith("|") ? line : `| ${line} |`))
		.join("\n")
}

function findRule(name: string): Rule | undefined {
	const target = slugify(name)
	return loadRules().find(
		(rule) => rule.name === target || slugify(basename(rule.path)) === target,
	)
}

function setRuleEnabled(rule: Rule, enabled: boolean): void {
	const content = readFileSync(rule.path, "utf8")
	if (/^enabled:\s*(true|false)\s*$/m.test(content)) {
		writeFileSync(
			rule.path,
			content.replace(/^enabled:\s*(true|false)\s*$/m, `enabled: ${enabled}`),
			"utf8",
		)
		return
	}
	writeFileSync(rule.path, content.replace(/^---\s*$/m, `---\nenabled: ${enabled}`), "utf8")
}

function configureRule(input: string): string {
	const [command, ...nameParts] = input.trim().split(/\s+/)
	const name = nameParts.join(" ")
	if (!command || !name) {
		return "Usage: /hookify:configure enable <name>, disable <name>, or delete <name>."
	}

	const rule = findRule(name)
	if (!rule) return `No Hookify rule found for ${name}.`

	if (command === "enable") {
		setRuleEnabled(rule, true)
		return `Enabled Hookify rule ${rule.name}.`
	}
	if (command === "disable") {
		setRuleEnabled(rule, false)
		return `Disabled Hookify rule ${rule.name}.`
	}
	if (command === "delete" || command === "remove") {
		unlinkSync(rule.path)
		return `Deleted Hookify rule ${rule.name}.`
	}

	return "Usage: /hookify:configure enable <name>, disable <name>, or delete <name>."
}

const plugin: AgentPlugin = {
	name: "hookify",
	manifest: {
		capabilities: ["commands", "hooks"],
	},
	setup(api, ctx) {
		workspaceRoot = resolve(ctx.workspaceInfo?.rootPath ?? process.cwd())
		api.registerCommand({
			name: "hookify",
			description: "Create a workspace-local Hookify block rule.",
			handler: (input) => createRule(input),
		})
		api.registerCommand({
			name: "hookify:list",
			description: "List workspace-local Hookify rules.",
			handler: () => listRules(),
		})
		api.registerCommand({
			name: "hookify:configure",
			description: "Enable, disable, or delete a workspace-local Hookify rule.",
			handler: (input) => configureRule(input),
		})
	},
	hooks: {
		beforeTool({ toolCall, input }) {
			const context = buildEvaluationContext(toolCall.toolName, input)
			if (!context) return undefined
			const matches = loadRules().filter((rule) => ruleMatches(rule, context))
			if (matches.length === 0) return undefined
			return {
				skip: true,
				reason: formatBlockMessage(matches),
			}
		},
	},
}

export default plugin
