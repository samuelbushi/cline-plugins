import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "agentforce-adlc",
	manifest: {
		capabilities: ["skills"],
	},
}

export default plugin
