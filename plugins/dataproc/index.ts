import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "dataproc",
	manifest: {
		capabilities: ["skills"],
	},
}

export default plugin
