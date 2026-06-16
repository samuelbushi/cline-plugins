import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "math-olympiad",
	manifest: {
		capabilities: ["rules", "skills"],
	},

	setup(api) {
		api.registerRule({
			id: "math-olympiad-proof-integrity",
			source: "math-olympiad",
			content:
				"For olympiad and competition math tasks, do not use web lookup or external solution search unless the user explicitly asks for research instead of solving. Prefer pure reasoning, separate discovery from proof verification, state gaps plainly, and say no confident solution rather than presenting a bluff.",
		})
	},
}

export default plugin
