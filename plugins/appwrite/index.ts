import type { AgentPlugin } from "@cline/sdk"

const APPWRITE_DOCS_MCP_URL = "https://mcp-for-docs.appwrite.io"

const plugin: AgentPlugin = {
	name: "appwrite",
	manifest: {
		capabilities: ["mcp", "skills"],
	},

	setup(api) {
		api.registerMcpServer({
			name: "appwrite-docs",
			transport: {
				type: "streamableHttp",
				url: APPWRITE_DOCS_MCP_URL,
			},
		})

		const {
			APPWRITE_ENDPOINT,
			APPWRITE_PROJECT_ID,
			APPWRITE_API_KEY,
		} = process.env

		if (APPWRITE_ENDPOINT && APPWRITE_PROJECT_ID && APPWRITE_API_KEY) {
			api.registerMcpServer({
				name: "appwrite-api",
				transport: {
					type: "stdio",
					command: "uvx",
					args: ["mcp-server-appwrite"],
					env: {
						APPWRITE_ENDPOINT,
						APPWRITE_PROJECT_ID,
						APPWRITE_API_KEY,
					},
				},
			})
		}
	},
}

export default plugin
