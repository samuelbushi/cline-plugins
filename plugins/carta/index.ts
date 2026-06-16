import type { AgentPlugin } from "@cline/sdk"

const PLUGIN_NAME = "carta"

const plugin: AgentPlugin = {
	name: PLUGIN_NAME,
	manifest: {
		capabilities: ["mcp", "skills", "rules"],
	},

	setup(api) {
		api.registerMcpServer({
			name: "carta",
			transport: {
				type: "streamableHttp",
				url: "https://mcp.app.carta.com/mcp",
			},
		})

		api.registerRule({
			id: "carta:sensitive-financial-data",
			source: PLUGIN_NAME,
			content: [
				"Carta workflows can expose confidential cap tables, investor records, fund financials, compensation benchmarks, signatures, notes, and deal data.",
				"Before calling Carta tools, confirm the requested account, company, fund, portfolio, or CRM record when the target is ambiguous.",
				"Ask before any write, create, update, enrichment, export, workbook generation, or large portfolio-wide scan unless the user already approved that exact action.",
				"Never reveal Carta OAuth tokens, API tokens, signing links, private stakeholder details, raw personal data, or sensitive notes beyond the user's requested scope.",
				"Clearly label Cline analysis, projections, conversion math, or scenario modeling as analysis, not as official Carta data, unless returned directly by Carta.",
				"Do not provide legal, tax, investment, compensation, or securities advice. Present Carta data, explain assumptions, and recommend review by qualified advisors for decisions.",
			].join("\n"),
		})
	},
}

export default plugin
