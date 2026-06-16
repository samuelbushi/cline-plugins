import type { AgentPlugin } from "@cline/sdk"

const APPWRITE_DOCS_MCP_URL = "https://mcp-for-docs.appwrite.io"
const PLUGIN_NAME = "appwrite"

const appwriteSafetyRule = [
	"Appwrite plugin safety:",
	"- Treat Appwrite API MCP calls, CLI pushes, deployments, deletes, permission changes, auth provider changes, function executions, and schema migrations as live project operations.",
	"- Before any live mutation, confirm the endpoint, project ID, resource type, resource ID, and exact command or MCP action with the user.",
	"- Prefer read-only inspection of local files, docs, or project state before mutation.",
	"- Never print, commit, summarize verbatim, or store Appwrite API keys, JWTs, session secrets, `.env` values, or credential-bearing `appwrite.config.json` content.",
	"- Keep browser/mobile SDK examples limited to endpoint plus project ID; API keys belong only in trusted server-side code or user-managed environment variables.",
	"- For deployments, inspect `appwrite.config.json` first and summarize the site/function path, build/runtime settings, and target project before asking for confirmation.",
].join("\n")

function deploymentPrompt(kind: "function" | "site", input: string): string {
	const target = input.trim()
	const label = kind === "function" ? "Appwrite function" : "Appwrite site"
	const resource = kind === "function" ? "functions" : "sites"

	return [
		`Help me prepare an ${label} deployment${target ? ` for ${target}` : ""}.`,
		"",
		"Use the bundled Appwrite skills. First inspect local Appwrite configuration and relevant project files. Do not run `appwrite push`, `appwrite deploy`, `appwrite delete`, `--force`, or any live project mutation until I confirm the exact command and target.",
		"",
		`Focus on ${resource}: verify CLI/auth readiness, endpoint, project ID, resource ID, local path, build/runtime settings, environment variable needs, and any risky changes before proposing the deployment command.`,
	].join("\n")
}

const plugin: AgentPlugin = {
	name: PLUGIN_NAME,
	manifest: {
		capabilities: ["mcp", "skills", "commands", "rules"],
	},

	setup(api) {
		api.registerRule({
			id: "appwrite:safety",
			source: PLUGIN_NAME,
			content: appwriteSafetyRule,
		})

		api.registerCommand({
			name: "appwrite-deploy-function",
			description: "Prepare a guarded Appwrite function deployment workflow.",
			handler: (input) => ({
				reply: "Preparing a guarded Appwrite function deployment workflow.",
				submitPrompt: deploymentPrompt("function", input),
			}),
		})

		api.registerCommand({
			name: "appwrite-deploy-site",
			description: "Prepare a guarded Appwrite site deployment workflow.",
			handler: (input) => ({
				reply: "Preparing a guarded Appwrite site deployment workflow.",
				submitPrompt: deploymentPrompt("site", input),
			}),
		})

		api.registerMcpServer({
			name: "appwrite-docs",
			transport: {
				type: "streamableHttp",
				url: APPWRITE_DOCS_MCP_URL,
			},
		})

		const {
			APPWRITE_ENDPOINT,
			APPWRITE_PROJECT_ID,
			APPWRITE_API_KEY,
		} = process.env

		if (APPWRITE_ENDPOINT && APPWRITE_PROJECT_ID && APPWRITE_API_KEY) {
			api.registerMcpServer({
				name: "appwrite-api",
				transport: {
					type: "stdio",
					command: "uvx",
					args: ["mcp-server-appwrite"],
					env: {
						APPWRITE_ENDPOINT,
						APPWRITE_PROJECT_ID,
						APPWRITE_API_KEY,
					},
				},
			})
		}
	},
}

export default plugin
