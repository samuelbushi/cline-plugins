import type { AgentPlugin } from "@cline/sdk"

type Candidate = {
	path: string
	text: string
}

type SecurityRule = {
	name: string
	reminder: string
	pathFilter?: (path: string) => boolean
	pathCheck?: (path: string) => boolean
	substrings?: string[]
	regex?: RegExp
}

const JS_EXTS = [
	".js",
	".jsx",
	".ts",
	".tsx",
	".mjs",
	".cjs",
	".mts",
	".cts",
	".vue",
	".svelte",
]
const PY_EXTS = [".py", ".pyi", ".ipynb"]
const GO_EXTS = [".go"]
const HTML_EXTS = [".html", ".htm", ".vue", ".svelte", ".tsx", ".jsx"]
const DOC_EXTS = [".md", ".mdx", ".txt", ".rst", ".json", ".yaml", ".yml"]

const WRITE_TOOL_NAMES = new Set(["apply_patch", "editor"])

const SECURITY_RULES: SecurityRule[] = [
	{
		name: "github_actions_workflow",
		pathFilter: (path) =>
			path.includes(".github/workflows/") &&
			(path.endsWith(".yml") || path.endsWith(".yaml")),
		regex:
			/\brun\s*:[^\n]*(\$\{\{\s*(github\.event|github\.head_ref|github\.ref_name|github\.ref|inputs\.|vars\.)|github\.event\.)/,
		reminder:
			"GitHub Actions workflow files can be command-injection surfaces. Do not interpolate untrusted event fields directly in run commands; pass them through env variables and quote them.",
	},
	{
		name: "child_process_exec",
		pathFilter: hasJsExtension,
		substrings: ["child_process.exec", "execSync("],
		regex: /(?<![a-zA-Z0-9_.])exec\(/,
		reminder:
			"child_process.exec runs through a shell. Prefer execFile or spawn with an argument array when any input can be attacker-controlled.",
	},
	{
		name: "new_function_injection",
		pathFilter: hasJsExtension,
		substrings: ["new Function"],
		reminder:
			"new Function with interpolated strings is code injection. Use property access, a safe expression parser, or a typed dispatch table instead.",
	},
	{
		name: "eval_injection",
		pathFilter: (path) => !hasDocExtension(path),
		regex: /(?<![a-zA-Z0-9_.])eval\(/,
		reminder:
			"eval executes arbitrary code. Use JSON.parse, ast.literal_eval, or a safe expression parser instead.",
	},
	{
		name: "react_dangerously_set_html",
		pathFilter: hasJsExtension,
		substrings: ["dangerouslySetInnerHTML"],
		reminder:
			"dangerouslySetInnerHTML can create XSS when content is not sanitized. Use safe rendering or a sanitizer such as DOMPurify.",
	},
	{
		name: "document_write_xss",
		pathFilter: hasJsExtension,
		substrings: ["document.write"],
		reminder:
			"document.write can create XSS and parser confusion. Prefer safe DOM construction APIs.",
	},
	{
		name: "innerHTML_xss",
		pathFilter: hasJsExtension,
		substrings: [".innerHTML =", ".innerHTML="],
		reminder:
			"innerHTML assignment is an XSS sink for untrusted content. Prefer textContent or sanitize HTML before assignment.",
	},
	{
		name: "pickle_deserialization",
		pathFilter: hasPythonExtension,
		regex:
			/(?<![a-zA-Z0-9_])pickle\.(loads?|Unpickler)\b|(?<![a-zA-Z0-9_])pkl_load\(/,
		reminder:
			"pickle deserialization can execute arbitrary code. Prefer JSON or a schema-validated typed deserializer for untrusted data.",
	},
	{
		name: "os_system_injection",
		pathFilter: hasPythonExtension,
		substrings: ["from os import system"],
		regex: /\bos\.system\s*\(/,
		reminder:
			"os.system runs through a shell. Prefer subprocess.run with an argument list and no shell.",
	},
	{
		name: "python_subprocess_shell",
		pathFilter: hasPythonExtension,
		regex:
			/subprocess\.(?:run|call|Popen|check_output|check_call)\([^)\n]*shell\s*=\s*True/,
		reminder:
			"subprocess with shell=True enables command injection. Pass arguments as a list without shell=True.",
	},
	{
		name: "go_exec_shell_injection",
		pathFilter: hasGoExtension,
		regex: /exec\.Command\(\s*"(?:sh|bash|\/bin\/sh|\/bin\/bash)"/,
		reminder:
			"exec.Command with sh or bash enables command injection. Call the target program directly with separate arguments.",
	},
	{
		name: "unsafe_yaml_load",
		pathFilter: hasPythonExtension,
		regex: /\byaml\.load\s*\((?![^)\n]{0,80}\bSafe)/,
		reminder:
			"yaml.load can construct arbitrary Python objects. Use yaml.safe_load and validate the result against a schema.",
	},
	{
		name: "node_createcipher_no_iv",
		pathFilter: hasJsExtension,
		regex: /\bcrypto\.(createCipher|createDecipher)\b/,
		reminder:
			"crypto.createCipher and createDecipher use weak legacy key derivation. Use createCipheriv/createDecipheriv with an explicit IV.",
	},
	{
		name: "aes_ecb_mode",
		pathFilter: (path) =>
			hasJsExtension(path) || hasPythonExtension(path) || hasGoExtension(path),
		regex: /\bAES\.MODE_ECB\b|\bmodes\.ECB\s*\(|["']aes-\d+-ecb["']/,
		reminder:
			"AES-ECB leaks plaintext structure. Use an authenticated mode such as AES-GCM, or CBC plus authentication.",
	},
	{
		name: "tls_verification_disabled",
		pathFilter: (path) => !hasDocExtension(path),
		regex:
			/\bverify\s*=\s*False\b|rejectUnauthorized\s*:\s*false|InsecureSkipVerify\s*:\s*true|NODE_TLS_REJECT_UNAUTHORIZED\s*=\s*["']?0|ssl\._create_unverified_context|check_hostname\s*=\s*False/,
		reminder:
			"Disabling TLS verification allows man-in-the-middle attacks. Add the development CA to trust or use a proper certificate.",
	},
	{
		name: "marshal_loads",
		pathFilter: hasPythonExtension,
		regex: /\bmarshal\.loads?\s*\(/,
		reminder:
			"marshal deserialization can execute unsafe Python object loading patterns. Do not use it for untrusted data.",
	},
	{
		name: "shelve_open",
		pathFilter: hasPythonExtension,
		regex: /\bshelve\.open\s*\(/,
		reminder:
			"shelve uses pickle underneath and is unsafe for untrusted data.",
	},
	{
		name: "xml_unsafe_parse",
		pathFilter: hasPythonExtension,
		regex:
			/\b(xml\.etree\.ElementTree|ElementTree|ET)\.(parse|fromstring|XML)\s*\(|\bminidom\.(parse|parseString)\s*\(|\bxml\.sax\.(parse|make_parser)\b/,
		reminder:
			"Python standard XML parsers can be vulnerable to XXE or entity expansion attacks. Use defusedxml for untrusted XML.",
	},
	{
		name: "pickle_variants_load",
		pathFilter: hasPythonExtension,
		regex: /\b(cPickle|cloudpickle|dill)\.(load|loads)\s*\(/,
		reminder:
			"pickle-compatible loaders can execute arbitrary code. Avoid them for untrusted data.",
	},
	{
		name: "outerHTML_xss",
		pathFilter: hasJsExtension,
		substrings: [".outerHTML =", ".outerHTML="],
		reminder:
			"outerHTML assignment is an XSS sink equivalent to innerHTML. Prefer safe DOM APIs or sanitize first.",
	},
	{
		name: "insertAdjacentHTML_xss",
		pathFilter: hasJsExtension,
		substrings: [".insertAdjacentHTML("],
		reminder:
			"insertAdjacentHTML is an XSS sink. Prefer insertAdjacentText or sanitize HTML first.",
	},
	{
		name: "script_src_without_sri",
		pathFilter: (path) => hasExtension(path, HTML_EXTS),
		regex:
			/<script\s+(?![^>]{0,400}integrity\s*=)[^>]{0,200}src\s*=\s*["'](?:https?:)?\/\/[^"']{1,300}["'][^>]{0,100}>/,
		reminder:
			"External script tags should include Subresource Integrity and crossorigin to reduce CDN compromise risk.",
	},
	{
		name: "torch_unsafe_load",
		pathFilter: hasPythonExtension,
		regex:
			/(?:\btorch\.load|\.torch_load)\s*\((?![^)\n]{0,200}weights_only\s*=\s*True)/,
		reminder:
			"torch.load can unpickle arbitrary Python objects. Use weights_only=True for tensor-only checkpoints.",
	},
	{
		name: "yaml_unsafe_load_variants",
		pathFilter: hasPythonExtension,
		regex: /(?:\byaml\.unsafe_load|\.yaml_unsafe_load)\s*\(/,
		reminder:
			"yaml.unsafe_load constructs arbitrary Python objects. Use yaml.safe_load and schema validation.",
	},
	{
		name: "pickle_wrapper_load",
		pathFilter: hasPythonExtension,
		regex:
			/\bjoblib\.load\s*\(|\b(?:pd|pandas)\.read_pickle\s*\(|\.cloudpickle_load\s*\(|\b(?:np|numpy)\.load\s*\([^)\n]{0,200}allow_pickle\s*=\s*True/,
		reminder:
			"Wrapper APIs that load pickle data can execute arbitrary code. Avoid them for untrusted files.",
	},
]

function hasExtension(path: string, extensions: string[]): boolean {
	const normalized = path.toLowerCase()
	return extensions.some((extension) => normalized.endsWith(extension))
}

function hasJsExtension(path: string): boolean {
	return hasExtension(path, JS_EXTS)
}

function hasPythonExtension(path: string): boolean {
	return hasExtension(path, PY_EXTS)
}

function hasGoExtension(path: string): boolean {
	return hasExtension(path, GO_EXTS)
}

function hasDocExtension(path: string): boolean {
	return hasExtension(path, DOC_EXTS)
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === "object" && !Array.isArray(value)
}

function stringField(
	record: Record<string, unknown>,
	names: string[],
): string | undefined {
	for (const name of names) {
		const value = record[name]
		if (typeof value === "string" && value.trim()) {
			return value
		}
	}
	return undefined
}

function parseApplyPatch(patch: string): Candidate[] {
	let currentPath = "patch"
	const additionsByPath = new Map<string, string[]>()

	for (const line of patch.split(/\r?\n/)) {
		for (const prefix of [
			"*** Add File: ",
			"*** Update File: ",
			"*** Delete File: ",
			"*** Move to: ",
		]) {
			if (line.startsWith(prefix)) {
				currentPath = line.slice(prefix.length).trim() || "patch"
				if (!additionsByPath.has(currentPath)) {
					additionsByPath.set(currentPath, [])
				}
				continue
			}
		}

		if (line.startsWith("+") && !line.startsWith("+++")) {
			const additions = additionsByPath.get(currentPath) ?? []
			additions.push(line.slice(1))
			additionsByPath.set(currentPath, additions)
		}
	}

	return [...additionsByPath.entries()]
		.map(([path, lines]) => ({ path, text: lines.join("\n") }))
		.filter((candidate) => candidate.text.trim().length > 0)
}

function extractCandidates(input: unknown): Candidate[] {
	if (typeof input === "string") {
		return input.includes("*** Begin Patch")
			? parseApplyPatch(input)
			: [{ path: "input", text: input }]
	}

	if (Array.isArray(input)) {
		return input.flatMap(extractCandidates)
	}

	if (!isRecord(input)) {
		return []
	}

	const patch = stringField(input, ["input", "patch"])
	if (patch?.includes("*** Begin Patch")) {
		return parseApplyPatch(patch)
	}

	const candidates: Candidate[] = []
	const path =
		stringField(input, ["path", "file", "filePath", "filepath", "target"]) ??
		"input"
	const text = stringField(input, [
		"content",
		"text",
		"newContent",
		"newText",
		"new_text",
		"replacement",
		"code",
		"value",
	])
	if (text) {
		candidates.push({ path, text })
	}

	for (const nestedName of ["edits", "files", "changes"]) {
		const nested = input[nestedName]
		if (Array.isArray(nested)) {
			candidates.push(...nested.flatMap(extractCandidates))
		}
	}

	return candidates
}

function isSuppressedNearLine(
	lines: string[],
	index: number,
	ruleName: string,
): boolean {
	const marker = `security-guidance: allow ${ruleName}`
	return (
		lines[index]?.includes(marker) === true ||
		lines[index - 1]?.includes(marker) === true
	)
}

function lineMatchesRule(rule: SecurityRule, text: string): boolean {
	if (rule.substrings?.some((substring) => text.includes(substring))) {
		return true
	}
	if (rule.regex?.test(text)) {
		return true
	}
	return false
}

function matchesRule(rule: SecurityRule, candidate: Candidate): boolean {
	if (rule.pathFilter && !rule.pathFilter(candidate.path)) {
		return false
	}
	if (rule.pathCheck?.(candidate.path)) {
		return true
	}

	const lines = candidate.text.split(/\r?\n/)
	for (let index = 0; index < lines.length; index += 1) {
		if (
			lineMatchesRule(rule, lines[index] ?? "") &&
			!isSuppressedNearLine(lines, index, rule.name)
		) {
			return true
		}
	}
	return false
}

function findMatches(candidates: Candidate[]): Array<{
	path: string
	rule: SecurityRule
}> {
	const matches: Array<{ path: string; rule: SecurityRule }> = []
	for (const candidate of candidates) {
		for (const rule of SECURITY_RULES) {
			if (matchesRule(rule, candidate)) {
				matches.push({ path: candidate.path, rule })
			}
		}
	}
	return matches
}

const plugin: AgentPlugin = {
	name: "security-guidance",
	manifest: {
		capabilities: ["hooks", "rules"],
	},

	setup(api) {
		api.registerRule({
			id: "security-guidance-review",
			source: "security-guidance",
			content:
				"When security-guidance blocks a write, treat it as actionable security feedback. Prefer the safer API or pattern named in the message. If the risky construct is intentionally required, explain the trust boundary and add a narrow inline comment using `security-guidance: allow <rule-name>` near the code before retrying.",
		})
	},

	hooks: {
		beforeTool({ toolCall, input }) {
			if (!WRITE_TOOL_NAMES.has(toolCall.toolName)) {
				return undefined
			}

			const candidates = extractCandidates(input)
			if (candidates.length === 0) {
				return undefined
			}

			const matches = findMatches(candidates)
			if (matches.length === 0) {
				return undefined
			}

			const details = matches
				.slice(0, 3)
				.map(
					({ path, rule }) =>
						`${path}: ${rule.name}. ${rule.reminder}`,
				)
				.join("\n\n")
			const extra =
				matches.length > 3
					? `\n\nAnd ${matches.length - 3} more security-guidance warning(s).`
					: ""

			return {
				skip: true,
				reason: `security-guidance blocked this write because it matched risky security pattern(s):\n\n${details}${extra}\n\nUse a safer pattern, or add a narrow inline comment \`security-guidance: allow <rule-name>\` only when the user accepts the risk.`,
			}
		},
	},
}

export default plugin
