import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "pydantic-ai",
	manifest: {
		capabilities: ["skills"],
	},
}

export default plugin
