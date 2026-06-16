import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "microsoft-docs",
	manifest: {
		capabilities: ["mcp"],
	},
	setup(api) {
		api.registerMcpServer({
			name: "microsoft-learn",
			transport: {
				type: "streamableHttp",
				url: "https://learn.microsoft.com/api/mcp",
			},
		})
	},
}

export default plugin
