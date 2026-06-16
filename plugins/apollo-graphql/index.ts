import type { AgentPlugin } from "@cline/sdk"

const GRAPHOS_MCP_URL = "https://mcp.apollographql.com"

const plugin: AgentPlugin = {
	name: "apollo-graphql",
	manifest: {
		capabilities: ["mcp", "skills"],
	},

	setup(api) {
		api.registerMcpServer({
			name: "apollo-graphos-tools",
			transport: {
				type: "streamableHttp",
				url: GRAPHOS_MCP_URL,
			},
		})
	},
}

export default plugin
