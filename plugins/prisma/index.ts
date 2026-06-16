import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "prisma",
	manifest: {
		capabilities: ["mcp"],
	},
	setup(api) {
		api.registerMcpServer({
			name: "prisma",
			transport: {
				type: "streamableHttp",
				url: "https://mcp.prisma.io/mcp",
			},
		})
	},
}

export default plugin
