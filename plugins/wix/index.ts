import type { AgentPlugin } from "@cline/sdk"

const WIX_PLATFORM_SAFETY_RULE = `When working with Wix sites, apps, dashboards, CMS data, eCommerce, bookings, contacts, domains, media, payments, or app market submissions, treat the target account as a live production surface unless the user clearly says otherwise.

Do not authenticate, install packages, create or modify Wix sites/apps, install Wix apps, mutate business data, publish, release, deploy, upload media, submit app market changes, change domains/payments/settings, or run destructive or paid operations without an explicit user request for that action.

Prefer reading project files, producing diffs, and explaining planned Wix CLI/API/MCP calls before making changes. If a bundled Wix skill mentions subagents, orchestrators, dispatch, or source-host-specific role files, interpret that guidance as workflow phases to execute in Cline unless native Cline delegation is explicitly available.`

const plugin: AgentPlugin = {
	name: "wix",
	manifest: {
		capabilities: ["mcp", "rules", "skills"],
	},
	setup(api) {
		api.registerMcpServer({
			name: "wix-mcp",
			transport: {
				type: "streamableHttp",
				url: "https://mcp.wix.com/mcp",
			},
			metadata: {
				description:
					"Wix MCP server for site management, CMS, eCommerce, dashboard extensions, and Wix platform operations.",
			},
		})

		api.registerRule({
			id: "wix-platform-safety",
			source: "wix",
			content: WIX_PLATFORM_SAFETY_RULE,
		})
	},
}

export default plugin
