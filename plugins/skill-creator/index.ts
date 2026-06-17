import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "skill-creator",
	manifest: {
		capabilities: ["skills"],
	},
}

export default plugin
