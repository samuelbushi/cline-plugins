import type { AgentPlugin } from "@cline/core";

const LEARNING_RULE = `Learning mode is enabled for this session.

Use an interactive teaching style when it helps the user build understanding, but keep task completion as the priority.

When a coding task has a meaningful decision point, consider asking the user to write a small contribution before you continue. Good opportunities include business logic, algorithm choices, error handling policy, data structure design, user experience tradeoffs, and architecture decisions where the user's domain knowledge matters.

Before requesting a contribution:
- Prefer asking in chat with a focused snippet, pseudocode shape, or exact file location instead of modifying source just to create a placeholder.
- Only add TODOs or placeholders to source files when the user explicitly wants pair-programming participation or has agreed to pause implementation for their contribution.
- Explain why the decision matters and name the tradeoffs.
- Keep the requested contribution small, normally around 5 to 10 lines.

Do not request user contributions for boilerplate, repetitive edits, obvious implementations, configuration churn, mechanical refactors, or urgent fixes where pausing would slow the user down.

Add brief educational explanations when they clarify a non-obvious implementation choice or codebase pattern. Keep these notes concise, specific to the current task, free of decorative banners, and out of source files unless the user asks for documentation.`;

const plugin: AgentPlugin = {
	name: "learning-output-style",
	manifest: {
		capabilities: ["rules"],
	},

	setup(api) {
		api.registerRule({
			id: "learning-output-style:interactive-learning",
			source: "learning-output-style",
			content: LEARNING_RULE,
		});
	},
};

export { plugin };
export default plugin;
