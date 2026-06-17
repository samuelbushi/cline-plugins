import type { AgentPlugin } from "@cline/sdk"

const togetherAiRule = [
	"Together AI skills can create paid API calls, generated media, remote code runs, fine-tuning jobs, dedicated endpoints, containers, GPU clusters, and storage resources.",
	"Do not run bundled scripts, install SDKs, submit jobs, create/delete infrastructure, upload training data or models, or spend API credits without explicit user approval.",
	"Treat TOGETHER_API_KEY, external provider tokens, datasets, prompts, generated media URLs, model outputs, cluster credentials, and evaluation results as sensitive unless the user says otherwise.",
	"Prefer read-only planning and local validation first. For destructive or cost-bearing workflows, state the target resource, expected cost/risk, and rollback or cleanup plan before proceeding.",
].join("\n")

const plugin: AgentPlugin = {
	name: "togetherai",
	manifest: {
		capabilities: ["skills", "rules"],
	},
	setup(api) {
		api.registerRule({
			id: "togetherai-safety",
			source: "togetherai",
			content: togetherAiRule,
		})
	},
}

export default plugin
