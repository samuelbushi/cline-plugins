import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "brightdata",
	manifest: {
		capabilities: ["skills", "rules"],
	},

	setup(api) {
		api.registerRule({
			id: "brightdata:web-data-guardrails",
			source: "brightdata",
			content: [
				"When using Bright Data workflows, keep web data collection scoped, authorized, and cost-aware.",
				"Before running Bright Data CLI, API, MCP, proxy, browser, or scraper operations, confirm the target, purpose, expected volume, and any account or rate-limit constraints when they are not already clear.",
				"Do not help bypass paywalls, login walls, CAPTCHAs, robots restrictions, access controls, or site terms. If access is blocked or authorization is unclear, pause and ask for an approved data source, official API, account export, or explicit permission.",
				"Never print, commit, or paste Bright Data API keys, proxy passwords, browser credentials, session cookies, or collected personal data unless the user explicitly asks for a sanitized example.",
				"Do not disable TLS verification or certificate validation. If proxy certificate setup is required, guide the user to install the relevant CA certificate instead of weakening transport security.",
			].join("\n"),
		})
	},
}

export default plugin
