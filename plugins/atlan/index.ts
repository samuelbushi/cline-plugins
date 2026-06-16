import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "atlan",
	manifest: {
		capabilities: ["mcp"],
	},
	setup(api) {
		api.registerMcpServer({
			name: "atlan",
			transport: {
				type: "streamableHttp",
				url: "https://mcp.atlan.com/mcp",
			},
		})
	},
}

export default plugin
