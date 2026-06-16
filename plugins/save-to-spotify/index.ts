import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "save-to-spotify",
	manifest: {
		capabilities: ["skills"],
	},
}

export default plugin
