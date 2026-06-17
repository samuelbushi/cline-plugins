import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "fastly-agent-toolkit",
	manifest: {
		capabilities: ["rules", "skills"],
	},
	setup(api) {
		api.registerRule({
			id: "fastly-agent-toolkit:production-change-safety",
			source: "fastly-agent-toolkit",
			content: [
				"Fastly changes can affect production edge traffic globally.",
				"Prefer read-only inspection and local validation before live Fastly changes.",
				"Ask for explicit user confirmation before activating service versions, purge-all, changing TLS, editing origins, modifying WAF or rate-limit rules, deploying Compute packages, deleting stores, or mutating account access.",
				"Never print, paste, or commit Fastly API tokens. Avoid verbose/debug output around requests that include Fastly-Key headers.",
			].join("\n"),
		})
	},
}

export default plugin
