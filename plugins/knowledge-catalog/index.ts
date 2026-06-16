import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "knowledge-catalog",
	manifest: {
		capabilities: ["skills"],
	},
}

export default plugin
