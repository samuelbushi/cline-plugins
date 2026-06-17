import type { AgentPlugin } from "@cline/sdk"

const terraformRule = [
	"Terraform MCP tools can inspect infrastructure metadata and may help generate or change Terraform configuration.",
	"Prefer read-only discovery and planning first. Do not run or recommend apply, destroy, import, state mutation, workspace deletion, or credential changes without explicit user approval.",
	"Treat Terraform state, plan output, variables, provider credentials, and TFE_TOKEN as sensitive. Do not print, commit, or persist secrets.",
	"Before making infrastructure changes, identify the target workspace/project, provider account, environment, and blast radius.",
].join("\n")

const plugin: AgentPlugin = {
	name: "terraform",
	manifest: {
		capabilities: ["mcp", "rules"],
	},
	setup(api) {
		api.registerMcpServer({
			name: "terraform",
			transport: {
				type: "stdio",
				command: "docker",
				args: [
					"run",
					"-i",
					"--rm",
					"-e",
					"TFE_TOKEN",
					"hashicorp/terraform-mcp-server:0.4.0",
				],
			},
		})

		api.registerRule({
			id: "terraform-safety",
			source: "terraform",
			content: terraformRule,
		})
	},
}

export default plugin
