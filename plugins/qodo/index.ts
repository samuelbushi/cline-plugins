import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "qodo",
	manifest: {
		capabilities: ["skills", "rules"],
	},

	setup(api) {
		api.registerRule({
			id: "qodo-review-safety",
			source: "qodo",
			content:
				"When using Qodo workflows, keep API keys and provider credentials out of chat and project files. Ask before calling Qodo or git provider APIs, posting PR/MR comments, resolving review threads, committing, pushing, or changing CI/review configuration. Prefer read-only inspection and local patch proposals until the user explicitly asks for external side effects.",
		})
	},
}

export default plugin
