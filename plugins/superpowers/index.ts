import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "superpowers",
	manifest: {
		capabilities: ["skills", "rules"],
	},

	setup(api) {
		api.registerRule({
			id: "superpowers-cline-compatibility",
			source: "superpowers",
			content:
				"Superpowers is a bundled workflow skill library. Use the Cline skills tool to load Superpowers skills when they match the user's request. Do not run copied examples, helper scripts, subagents, mutating git commands, package installs, or browser/server workflows unless the user has approved that action in the current task. Read-only git inspection such as status, diff, log, and rev-parse is allowed.",
		})
	},
}

export default plugin
