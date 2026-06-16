import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "prisma",
	manifest: {
		capabilities: ["mcp"],
	},
	setup(api) {
		api.registerMcpServer({
			name: "prisma-local",
			transport: {
				type: "stdio",
				command: "npx",
				args: ["-y", "prisma", "mcp"],
			},
		})

		api.registerMcpServer({
			name: "prisma-remote",
			transport: {
				type: "streamableHttp",
				url: "https://mcp.prisma.io/mcp",
			},
		})
	},
}

export default plugin
