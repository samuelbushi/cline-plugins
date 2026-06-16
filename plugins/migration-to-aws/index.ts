import type { AgentPlugin } from "@cline/sdk"

const MIGRATION_STANDARDS_RULE = [
	"For GCP-to-AWS migration work:",
	"- Re-platform by default: select AWS services that match GCP workload types, such as Cloud Run to ECS Fargate and Cloud SQL to RDS or Aurora.",
	"- Default to development-tier sizing unless production, compliance, traffic, or availability requirements are explicit.",
	"- Estimate costs before generating infrastructure code.",
	"- Use Terraform as the default IaC format for migration artifacts.",
	"- Preserve existing application architecture patterns unless the user asks for modernization.",
].join("\n")

const plugin: AgentPlugin = {
	name: "migration-to-aws",
	manifest: {
		capabilities: ["mcp", "rules", "skills"],
	},

	setup(api) {
		api.registerMcpServer({
			name: "aws-knowledge",
			transport: {
				type: "streamableHttp",
				url: "https://knowledge-mcp.global.api.aws",
			},
			metadata: {
				description:
					"AWS documentation, regional availability, and architecture guidance for migration planning.",
			},
		})

		api.registerRule({
			id: "migration-to-aws-standards",
			source: "migration-to-aws",
			content: MIGRATION_STANDARDS_RULE,
		})
	},
}

export default plugin
