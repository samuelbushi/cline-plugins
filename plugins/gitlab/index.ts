import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "gitlab",
	manifest: {
		capabilities: ["mcp"],
	},
	setup(api) {
		api.registerMcpServer({
			name: "gitlab",
			transport: {
				type: "streamableHttp",
				url: "https://gitlab.com/api/v4/mcp",
			},
		})
	},
}

export default plugin
