import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "pinecone",
	manifest: {
		capabilities: ["mcp", "commands", "rules", "skills"],
	},

	setup(api) {
		api.registerCommand({
			name: "pinecone-discord",
			description: "Show the Pinecone community Discord invite.",
			handler: async () =>
				"Join the Pinecone Discord welcome channel: https://discord.gg/gQPr3T9jRV",
		})

		api.registerRule({
			id: "pinecone-safety",
			source: "pinecone",
			content: [
				"When working with Pinecone, do not print, commit, or write PINECONE_API_KEY values into files. Keep the key in the environment used to start Cline.",
				"Ask before creating, deleting, or resizing indexes, changing index schemas, upserting or deleting vectors/documents, uploading or deleting assistant files, or changing n8n workflows.",
				"The bundled Pinecone MCP server is for integrated-index workflows. For standard indexes, advanced vector operations, or local project setup, prefer the bundled Pinecone skills and the user's installed Pinecone CLI or Python environment.",
			].join("\n"),
		})

		api.registerMcpServer({
			name: "pinecone",
			transport: {
				type: "stdio",
				command: "npx",
				args: ["-y", "@pinecone-database/mcp@0.2.1"],
			},
			metadata: {
				description:
					"Pinecone MCP server for integrated-index management, upserts, and queries.",
			},
		})
	},
}

export default plugin
