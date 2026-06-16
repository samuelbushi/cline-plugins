import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "aws-startup-advisor",
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

		api.registerMcpServer({
			name: "awspricing",
			transport: {
				type: "stdio",
				command: "uvx",
				args: ["awslabs.aws-pricing-mcp-server@1.0.31"],
			},
			env: {
				FASTMCP_LOG_LEVEL: "ERROR",
				AWS_REGION: "us-east-1",
			},
		})

		api.registerRule({
			id: "aws-startup-advisor-safety",
			source: "aws-startup-advisor",
			content:
				"When working with the aws-startup-advisor plugin, keep startup context private by default. Ask for explicit approval before sending private source code, account IDs, billing exports, pitch materials, investor/customer data, unreleased architecture, or confidential plans to AWS knowledge or pricing MCP servers; before reading billing/account inventory; before creating migration folders, Terraform, scripts, or implementation artifacts; before installing or running CLIs; before deploying, changing IAM, requesting quotas, changing budgets, or mutating AWS resources; and before any cost-bearing action. Prefer sanitized summaries and cached/bundled reference data when that is enough.",
		})
	},
}

export default plugin
