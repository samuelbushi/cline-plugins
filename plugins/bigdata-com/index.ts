import type { AgentPlugin } from "@cline/sdk"

interface ResearchCommand {
	name: string
	description: string
	task: string
	requiresTarget?: boolean
}

const COMMANDS: ResearchCommand[] = [
	{
		name: "bigdata-quick-take",
		description: "Create a concise market-style quick take for a company.",
		task: "Create a concise quick take with current view, key drivers, risks, and near-term setup.",
		requiresTarget: true,
	},
	{
		name: "bigdata-company-brief",
		description: "Create a recent company developments brief.",
		task: "Create a company brief covering recent developments, fundamentals, sentiment, risks, and what matters next.",
		requiresTarget: true,
	},
	{
		name: "bigdata-investment-memo",
		description: "Create an investment memo with thesis, valuation, risks, and catalysts.",
		task: "Create an investment memo with thesis, variant perception, valuation framing, risks, catalysts, and a clearly labeled view.",
		requiresTarget: true,
	},
	{
		name: "bigdata-earnings",
		description: "Create an earnings preview, digest, reaction, or quality screen.",
		task: "Create an earnings-focused report. Infer whether the user wants preview, digest, reaction, or earnings-quality screen from the input, and ask if unclear.",
		requiresTarget: true,
	},
	{
		name: "bigdata-valuation",
		description: "Create a valuation snapshot or peer comparables view.",
		task: "Create a valuation view with assumptions, peer context, bull/base/bear framing, and valuation caveats.",
		requiresTarget: true,
	},
	{
		name: "bigdata-risk",
		description: "Create a company risk, moat, governance, or catalyst review.",
		task: "Create a risk-oriented review covering regulatory, competitive, operational, financial, macro, moat, governance, and catalyst considerations.",
		requiresTarget: true,
	},
	{
		name: "bigdata-macro",
		description: "Create country, regional, G7, or cross-market macro analysis.",
		task: "Create a macro analysis covering growth, inflation, policy, labor, market positioning, and investment implications.",
	},
	{
		name: "bigdata-sector",
		description: "Create sector, cross-sector, country-sector, or thematic research.",
		task: "Create sector or thematic research covering performance, valuation, earnings growth, cycle positioning, beneficiaries, risks, and implementation ideas.",
	},
	{
		name: "bigdata-ipo",
		description: "Create pre-IPO or post-IPO event research.",
		task: "Create IPO research. Infer pre-IPO, day-1, day-14, day-179, or day-365 workflow from the input, and keep the output balanced without buy, avoid, trading, or portfolio action calls.",
		requiresTarget: true,
	},
]

function buildPrompt(command: ResearchCommand, input: string): string {
	const target = input.trim()
	const targetInstruction =
		target.length > 0
			? `Target or focus: ${target}.`
			: command.requiresTarget
				? "No target was provided. Ask the user which company, security, country, region, sector, theme, or IPO event they want analyzed before using Bigdata.com MCP tools."
				: "No target was provided. Ask one concise clarifying question if the research scope is ambiguous."

	return [
		command.task,
		targetInstruction,
		"Use the bigdata-financial-research-analyst skill.",
		"Use Bigdata.com MCP tools for factual market, company, macro, news, events, transcript, filing, sentiment, and calendar context when needed.",
		"Separate facts from analysis, cite the evidence source in plain language, and include Bigdata.com attribution when Bigdata MCP data is used.",
		"Do not present outputs as personalized financial advice. Do not recommend position sizing, trading actions, or portfolio actions.",
		"Ask before generating or saving formal report files. Markdown in chat is the default.",
	].join("\n")
}

const plugin: AgentPlugin = {
	name: "bigdata-com",
	manifest: {
		capabilities: ["mcp", "commands", "skills"],
	},

	setup(api) {
		api.registerMcpServer({
			name: "bigdata.com",
			transport: {
				type: "streamableHttp",
				url: "https://mcp.bigdata.com",
			},
		})

		for (const command of COMMANDS) {
			api.registerCommand({
				name: command.name,
				description: command.description,
				handler(input) {
					return {
						reply: `Starting ${command.description.toLowerCase()}`,
						submitPrompt: buildPrompt(command, input),
					}
				},
			})
		}
	},
}

export default plugin
