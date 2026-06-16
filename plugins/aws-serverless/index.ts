import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "aws-serverless",
	manifest: {
		capabilities: ["mcp", "skills"],
	},

	setup(api) {
		api.registerMcpServer({
			name: "aws-serverless-mcp",
			transport: {
				type: "stdio",
				command: "uvx",
				args: ["awslabs.aws-serverless-mcp-server@0.1.19", "--allow-write"],
			},
			env: {
				FASTMCP_LOG_LEVEL: "ERROR",
			},
		})
	},
}

export default plugin
