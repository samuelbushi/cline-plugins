import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "session-report",
	manifest: {
		capabilities: ["skills"],
	},
}

export default plugin
