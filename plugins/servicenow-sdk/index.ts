import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "servicenow-sdk",
	manifest: {
		capabilities: ["skills"],
	},
}

export default plugin
