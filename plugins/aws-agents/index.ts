import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "aws-agents",
	manifest: {
		capabilities: ["mcp", "skills", "rules"],
	},

	setup(api) {
		api.registerMcpServer({
			name: "awsknowledge",
			transport: {
				type: "streamableHttp",
				url: "https://knowledge-mcp.global.api.aws",
			},
		})

		api.registerRule({
			id: "aws-agents-safety",
			source: "aws-agents",
			content:
				"When working with AWS AgentCore through the aws-agents plugin, prefer read-only inspection and planning first. Ask for explicit user approval before installing or updating CLIs, scaffolding projects, deploying resources, changing IAM/auth/policies, creating gateways or credentials, storing secrets, invoking live agents, enabling online evals or observability, deleting or tearing down resources, running commands that access an AWS account, or sending confidential project details to the remote awsknowledge MCP server. Never paste AWS credentials, API keys, OAuth secrets, JWTs, or customer data into chat, logs, generated files, or MCP queries.",
		})
	},
}

export default plugin
