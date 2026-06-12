import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "agent-browser",
	manifest: {
		capabilities: ["skills"],
	},
}

export default plugin
