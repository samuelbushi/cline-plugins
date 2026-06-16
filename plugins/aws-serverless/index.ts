import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "aws-serverless",
	manifest: {
		capabilities: ["mcp", "skills", "rules"],
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

		api.registerRule({
			id: "aws-serverless-safety",
			source: "aws-serverless",
			content:
				"When working with AWS Serverless through the aws-serverless plugin, plan and inspect before acting. Ask for explicit user approval before installing or updating CLIs, creating or editing projects, running MCP tools or shell commands that write files, deploying stacks, invoking Lambda functions or Step Functions, reading CloudWatch logs or traces, changing IAM, DNS, certificates, custom domains, networking, EventBridge schemas, S3/CloudFront assets, or any AWS resource, deleting resources, invalidating caches, enabling sensitive-data access, or incurring cost. Never paste AWS credentials, API keys, tokens, customer data, request or response bodies, log excerpts, or other sensitive data into chat, generated files, shell history, or MCP queries unless the user explicitly provides and approves that exact use.",
		})
	},
}

export default plugin
