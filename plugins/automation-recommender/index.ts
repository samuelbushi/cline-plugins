import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "automation-recommender",
	manifest: {
		capabilities: ["skills"],
	},
}

export default plugin
