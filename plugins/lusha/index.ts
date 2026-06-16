import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "lusha",
	manifest: {
		capabilities: ["mcp", "rules", "skills"],
	},

	setup(api) {
		api.registerMcpServer({
			name: "lusha",
			transport: {
				type: "streamableHttp",
				url: "https://mcp.lusha.com/mcp/claude",
				headers: {
					"X-Lusha-Plugin": "claude",
					"X-Lusha-Plugin-Version": "0.1.0",
				},
			},
		})

		api.registerRule({
			id: "lusha-contact-data-boundary",
			source: "lusha",
			content:
				"Lusha returns B2B contact data and may consume account credits when revealing phones or emails. State reveal costs when the tools expose them, ask before enriching large batches, avoid unnecessary re-reveals for the same contact, and do not export or persist contact data unless the user explicitly asks.",
		})
	},
}

export default plugin
