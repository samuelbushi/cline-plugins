import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "intercom",
	manifest: {
		capabilities: ["mcp", "skills", "rules"],
	},

	setup(api) {
		api.registerMcpServer({
			name: "intercom",
			transport: {
				type: "streamableHttp",
				url: "https://mcp.intercom.com/mcp",
			},
			metadata: {
				description:
					"Read Intercom conversations, contacts, and companies through Intercom's remote MCP server.",
			},
		})

		api.registerRule({
			id: "intercom:support-data-safety",
			source: "intercom",
			content: [
				"Intercom conversations, contacts, companies, and Messenger identity data can contain sensitive customer and business information. Share only the data needed for the user's task and cite Intercom object IDs instead of copying unnecessary raw content.",
				"Before creating, updating, publishing, or otherwise mutating Help Center articles, Messenger settings, contacts, companies, conversations, tags, segments, workspace configuration, or Fin setup, show the exact intended change and ask for explicit approval.",
				"Before installing global CLI packages, running Intercom workspace provisioning, changing shell startup files, or persisting Intercom credentials, explain the local effect and ask for explicit approval.",
				"Do not ask users to paste Intercom access tokens or Messenger identity secrets into chat. Prefer local environment variables, OS keyrings, password managers, or CI secret stores, and never write secrets to source-controlled files.",
			].join("\n"),
		})
	},
}

export default plugin
