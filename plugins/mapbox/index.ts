import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "mapbox",
	manifest: {
		capabilities: ["mcp", "rules", "skills"],
	},

	setup(api) {
		api.registerMcpServer({
			name: "mapbox",
			transport: {
				type: "streamableHttp",
				url: "https://mcp.mapbox.com/mcp",
			},
		})

		api.registerMcpServer({
			name: "mapbox-devkit",
			transport: {
				type: "streamableHttp",
				url: "https://mcp-devkit.mapbox.com/mcp",
			},
		})

		api.registerMcpServer({
			name: "mapbox-docs",
			transport: {
				type: "streamableHttp",
				url: "https://mcp-docs.mapbox.com/mcp",
			},
		})

		api.registerRule({
			id: "mapbox-token-boundary",
			source: "mapbox",
			content:
				"Mapbox workflows can involve public access tokens, secret tokens, live location data, and billable API calls. Keep public tokens scoped and domain-restricted where possible, never expose secret tokens in client-side code or logs, ask before high-volume geocoding/routing/style operations, and prefer grounded MCP results for live place, route, or geospatial facts.",
		})
	},
}

export default plugin
