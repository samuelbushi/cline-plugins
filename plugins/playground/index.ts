import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "playground",
	manifest: {
		capabilities: ["skills"],
	},
}

export default plugin
