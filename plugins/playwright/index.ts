import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "playwright",
	manifest: {
		capabilities: ["mcp"],
	},
	setup(api) {
		api.registerMcpServer({
			name: "playwright",
			transport: {
				type: "stdio",
				command: "node",
				args: ["./node_modules/@playwright/mcp/cli.js"],
			},
		})
	},
}

export default plugin
