import type { AgentPlugin } from "@cline/sdk"

const PLUGIN_NAME = "outputai"

const outputaiRule = [
	"Output.ai workflow support is installed.",
	"When a user works on Output SDK or Output.ai workflows, prefer the bundled skills instead of inventing project conventions from scratch.",
	"Use outputai-project-context to orient in an existing project, outputai-plan-workflow before creating a new workflow, outputai-build-workflow when implementing from a plan, outputai-debug-workflow for failing runs, outputai-credentials for secrets, outputai-evals for quality evaluation, and outputai-sdk-patterns for implementation review.",
	"Do not run Output CLI commands, start local services, execute workflows, reset or stop runs, edit encrypted credentials, or write generated workflow files unless the user asked for that action or approved the specific next step.",
	"Treat workflow traces, prompt files, datasets, credentials, and generated artifacts as sensitive project data. Do not paste secrets or large trace payloads into chat unless the user explicitly requests it.",
].join("\n")

const plugin: AgentPlugin = {
	name: PLUGIN_NAME,
	manifest: {
		capabilities: ["rules", "skills"],
	},

	setup(api) {
		api.registerRule({
			id: `${PLUGIN_NAME}:workflow-routing`,
			source: PLUGIN_NAME,
			content: outputaiRule,
		})
	},
}

export default plugin
