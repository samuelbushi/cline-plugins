import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "hunter",
	manifest: {
		capabilities: ["skills", "mcp", "rules"],
	},
	setup(api) {
		api.registerMcpServer({
			name: "hunter",
			transport: {
				type: "streamableHttp",
				url: "https://mcp.hunter.io/mcp",
			},
			metadata: {
				displayName: "Hunter",
				description:
					"Find, verify, enrich, and organize professional contacts for B2B prospecting workflows.",
				requiresAuthentication: true,
			},
		})

		api.registerRule({
			id: "hunter:prospecting-safety",
			source: "hunter",
			content: [
				"Hunter workflows can expose personal contact data, consume Hunter credits, save or update leads, and add recipients to campaigns.",
				"Before running credit-consuming searches, inferred-domain searches, bulk verification, enrichment, lead/list mutations, or campaign-recipient changes, summarize the target scope, estimated credits, affected records, and ask for explicit confirmation.",
				"Treat discovered email addresses, contact profiles, enrichment data, campaign recipients, and Hunter search results as sensitive business and personal data. Share only what is needed for the user's task.",
				"Do not add recipients to running or active campaigns without an extra confirmation that names the campaign, status, recipient count, and outreach/schedule risk.",
				"Do not write Hunter API keys, OAuth tokens, contact exports, lead lists, or raw personal contact data into source-controlled files.",
			].join("\n"),
		})
	},
}

export default plugin
