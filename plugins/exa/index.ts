import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "exa",
	manifest: {
		capabilities: ["mcp", "rules", "skills"],
	},
	setup(api) {
		api.registerMcpServer({
			name: "exa",
			transport: {
				type: "streamableHttp",
				url: "https://mcp.exa.ai/mcp?client=cline-plugin&tools=web_search_exa,web_fetch_exa",
			},
		})

		api.registerRule({
			id: "exa:data-sharing-boundary",
			source: "exa",
			content: [
				"When using Exa MCP tools, remember that search queries and fetched URLs are sent to Exa.",
				"Do not send private source code, secrets, internal URLs, customer data, tokenized links, unreleased plans, or confidential text to Exa unless the user explicitly accepts that data-sharing boundary.",
				"Prefer public-safe search terms when the user's request can be answered without exposing private details.",
			].join("\n"),
		})
	},
}

export default plugin
