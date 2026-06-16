import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "circleback",
	manifest: {
		capabilities: ["mcp"],
	},
	setup(api) {
		api.registerMcpServer({
			name: "circleback",
			transport: {
				type: "streamableHttp",
				url: "https://app.circleback.ai/api/mcp",
			},
		})
	},
}

export default plugin
