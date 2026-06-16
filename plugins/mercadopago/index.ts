import { existsSync, readFileSync } from "node:fs"
import { dirname, join, parse } from "node:path"
import type { AgentPlugin } from "@cline/sdk"

const PLUGIN_NAME = "mercadopago"
const MERCADOPAGO_MCP_URL = "https://mcp.mercadopago.com/mcp"
const MANIFEST_FILES = [
	"package.json",
	"composer.json",
	"requirements.txt",
	"Pipfile",
	"pyproject.toml",
	"Gemfile",
	"pom.xml",
	"build.gradle",
	"build.gradle.kts",
	"go.mod",
]

const credentialPatterns = [
	/\b(?:TEST|APP_USR)-\d{12,}-\d{6}-[a-f0-9]{32}-U\d+\b/i,
	/Bearer\s+(?:TEST|APP_USR)-[^\s'"]+/i,
	/["']client_secret["']\s*[:=]\s*["'][a-f0-9]{32,}["']/i,
	/["']?(?:x-signature|webhook.?secret)["']?\s*[:=]\s*["'][a-zA-Z0-9+/]{20,}["']/i,
]

let workspaceRoot: string | undefined

function mpConnectPrompt(): string {
	return `Verify the Mercado Pago MCP connection.

Use the plugin-owned Cline MCP server named "mercadopago".

1. Check whether a real data tool such as mercadopago__application_list is available and returns an application payload. Do not rely on resource listing as the status check.
2. If only bootstrap auth tools are visible, call mercadopago__authenticate and show the returned authorization URL as a clickable link.
3. Tell me: "When you see Authentication Successful in the browser, come back and say anything."
4. When I respond, call mercadopago__application_list directly. Do not ask me to paste the callback URL because it contains a sensitive OAuth code.
5. If the connection still fails, explain the exact failure and suggest disabling/re-enabling the plugin or restarting the Cline session.`
}

function mpIntegratePrompt(input: string): string {
	const args = input.trim()
	return `Run the Mercado Pago integration workflow${args ? ` with these arguments: ${JSON.stringify(args)}` : ""}.

Use the bundled mp-integrate skill unless the first argument is "webhook" or "test-setup":

- "webhook": use the mp-webhooks skill.
- "test-setup": use the mp-test-setup skill.
- anything else: use mp-integrate.

The Mercado Pago MCP server named "mercadopago" is the source of truth for current documentation and product constraints. If it is not authenticated, start the OAuth flow with mercadopago__authenticate and never ask me to paste a callback URL.

Do not hardcode access tokens, public keys, webhook secrets, or payment IDs. Do not create or overwrite .env. Use .env.example for placeholders and ask before writing files, installing SDKs, creating test users, loading test funds, configuring webhooks, or making any payment-affecting API call.`
}

function mpReviewPrompt(input: string): string {
	const scope = input.trim() || "full"
	return `Review this project's Mercado Pago integration with scope ${JSON.stringify(scope)}.

Use the bundled mp-review skill. Pull the official quality checklist from the Mercado Pago MCP server named "mercadopago"; there is no offline substitute for the official checklist.

Also perform the fixed security floor: credentials are environment-backed, HTTPS is used, webhook signatures are validated, post-payment status is verified server-side, idempotency keys are sent on create calls, and test-user credentials are not committed to production deployment. Do not mutate Mercado Pago state during the review.`
}

function hasMercadoPagoManifestSignal(root: string): boolean {
	let current = root
	const stop = parse(current).root
	for (let depth = 0; depth < 32; depth++) {
		for (const name of MANIFEST_FILES) {
			const file = join(current, name)
			if (!existsSync(file)) {
				continue
			}
			try {
				if (readFileSync(file, "utf8").toLowerCase().includes("mercadopago")) {
					return true
				}
			} catch {
				// Ignore unreadable manifests.
			}
		}
		if (existsSync(join(current, ".git")) || current === stop) {
			break
		}
		current = dirname(current)
	}
	return false
}

function inputText(input: unknown): string {
	try {
		return JSON.stringify(input) ?? ""
	} catch {
		return String(input ?? "")
	}
}

function isEnvRead(toolName: string, text: string): boolean {
	const envPathPattern =
		/(^|[\s"'=:[\]{},;&|<>])((?:\.\/)?(?:[^"'`\s;&|<>]*\/)?\.env(?:\.[A-Za-z0-9_-]+)?)(?=$|[\s"'.,;:)\]}&|<>])/g
	const referencesProtectedEnvFile = [...text.matchAll(envPathPattern)].some(
		(match) => {
			const path = match[2] ?? ""
			return !/(^|[/\\])\.env\.example$/.test(path)
		},
	)
	if (!referencesProtectedEnvFile) {
		return false
	}
	if (/read/i.test(toolName)) {
		return true
	}
	return /(bash|command|terminal|shell|run)/i.test(toolName)
}

const plugin: AgentPlugin = {
	name: PLUGIN_NAME,
	manifest: {
		capabilities: ["commands", "hooks", "mcp", "rules", "skills"],
	},

	setup(api, ctx) {
		workspaceRoot = ctx.workspaceInfo?.rootPath

		api.registerMcpServer({
			name: "mercadopago",
			transport: {
				type: "streamableHttp",
				url: MERCADOPAGO_MCP_URL,
				headers: {
					"X-Invocation-Context": "cline-plugin",
				},
			},
		})

		api.registerCommand({
			name: "mp-connect",
			description: "Verify or start Mercado Pago MCP OAuth authentication.",
			handler: () => ({
				reply: "Starting Mercado Pago MCP connection check.",
				submitPrompt: mpConnectPrompt(),
			}),
		})

		api.registerCommand({
			name: "mp-integrate",
			description: "Run the Mercado Pago integration wizard, webhook flow, or test-user setup.",
			handler: (input) => ({
				reply: "Starting Mercado Pago integration workflow.",
				submitPrompt: mpIntegratePrompt(input),
			}),
		})

		api.registerCommand({
			name: "mp-review",
			description: "Review a Mercado Pago integration against MCP-backed quality and security checks.",
			handler: (input) => ({
				reply: "Starting Mercado Pago integration review.",
				submitPrompt: mpReviewPrompt(input),
			}),
		})

		api.registerRule({
			id: "mercadopago-payment-safety",
			source: PLUGIN_NAME,
			content:
				"For Mercado Pago work, use the mercadopago MCP server as the source of truth, keep credentials out of chat and source files, never create or overwrite .env files, ask before writes or payment-affecting actions, use idempotency keys on create calls, validate webhook signatures, and verify payment status server-side after redirects or notifications.",
		})
	},

	hooks: {
		beforeTool({ toolCall, input }) {
			const toolName = String(toolCall.toolName ?? "")
			const text = inputText(input)
			if (credentialPatterns.some((pattern) => pattern.test(text))) {
				return {
					stop: true,
					reason:
						"Blocked Mercado Pago credential exposure. Put tokens and webhook secrets in user-managed environment variables or a secret manager, not in chat, source files, commands, or tool inputs.",
				}
			}
			const root = workspaceRoot ?? process.cwd()
			if (isEnvRead(toolName, text) && hasMercadoPagoManifestSignal(root)) {
				return {
					stop: true,
					reason:
						"Blocked .env read in a Mercado Pago workspace. Read .env.example or ask the user which variable names exist without exposing secret values.",
				}
			}
			return undefined
		},
	},
}

export default plugin
