import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "codspeed",
	manifest: {
		capabilities: ["mcp"],
	},
	setup(api) {
		api.registerMcpServer({
			name: "codspeed",
			transport: {
				type: "streamableHttp",
				url: "https://mcp.codspeed.io/mcp",
			},
		})
	},
}

export default plugin
