import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "mcp-server-dev",
	manifest: {
		capabilities: ["rules", "skills"],
	},

	setup(api) {
		api.registerRule({
			id: "mcp-server-dev-design-defaults",
			source: "mcp-server-dev",
			content:
				"When designing MCP servers, pick the deployment shape before coding. Prefer remote streamable HTTP for cloud/API integrations, local stdio only for personal prototypes, and packaged local distribution only when the server must access the user's machine. Keep tool schemas narrow, describe side effects, validate inputs server-side, return structured recoverable errors, and never store tokens or user data in plaintext.",
		})
	},
}

export default plugin
