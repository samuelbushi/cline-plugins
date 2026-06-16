import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "planetscale",
	manifest: {
		capabilities: ["mcp"],
	},
	setup(api) {
		api.registerMcpServer({
			name: "planetscale",
			transport: {
				type: "streamableHttp",
				url: "https://mcp.pscale.dev/mcp/planetscale",
			},
		})
	},
}

export default plugin
