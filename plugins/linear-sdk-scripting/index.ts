import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "linear-sdk-scripting",
	manifest: {
		capabilities: ["skills"],
	},
}

export default plugin

