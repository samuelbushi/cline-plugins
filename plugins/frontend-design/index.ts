import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "frontend-design",
	manifest: {
		capabilities: ["skills"],
	},
}

export default plugin
