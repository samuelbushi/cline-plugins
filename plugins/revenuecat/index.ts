import type { AgentPlugin } from "@cline/sdk"

const REVENUECAT_MCP_URL = "https://mcp.revenuecat.ai/mcp"

const plugin: AgentPlugin = {
	name: "revenuecat",
	manifest: {
		capabilities: ["mcp", "skills", "rules"],
	},

	setup(api) {
		api.registerMcpServer({
			name: "revenuecat",
			transport: {
				type: "streamableHttp",
				url: REVENUECAT_MCP_URL,
			},
		})

		api.registerRule({
			id: "revenuecat:monetization-safety",
			source: "revenuecat",
			content: [
				"RevenueCat workflows can affect app monetization, customer access, analytics, webhooks, and store configuration.",
				"Before creating or changing projects, apps, products, entitlements, offerings, packages, webhooks, API keys, pricing, or SDK configuration, explain the intended change and get explicit user confirmation.",
				"Always list available projects first when using RevenueCat tools. If more than one project is available, ask the user which project to use before making project-scoped reads or writes.",
				"Never place RevenueCat secret API keys in client code. Public SDK keys can be embedded in apps; secret keys are server-side only.",
				"Treat revenue metrics, customer data, subscription status, and purchase history as sensitive business data. Summarize only what is needed for the user's task.",
			].join("\n"),
		})
	},
}

export default plugin
