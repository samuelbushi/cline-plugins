import type { AgentPlugin } from "@cline/sdk"

interface ResearchCommand {
	name: string
	description: string
	workflow: string
	targetKind: string
	defaultTargetQuestion: string
	requiresTarget?: boolean
	extraInstruction?: string
}

const COMMANDS: ResearchCommand[] = [
	{
		name: "bigdata-quick-take",
		description: "Create a concise PM-style quick take with current view, key drivers, risks, and near-term setup.",
		workflow: "quick take",
		targetKind: "company or security",
		defaultTargetQuestion: "which company or security they want analyzed",
		requiresTarget: true,
	},
	{
		name: "bigdata-company-brief",
		description: "Generate a comprehensive recent-developments brief for a company.",
		workflow: "company brief",
		targetKind: "company or security",
		defaultTargetQuestion: "which company or security they want analyzed",
		requiresTarget: true,
	},
	{
		name: "bigdata-catalyst-monitor",
		description: "Map upcoming catalysts, likely market implications, and watch points for a company.",
		workflow: "catalyst monitor",
		targetKind: "company or security",
		defaultTargetQuestion: "which company or security they want analyzed",
		requiresTarget: true,
	},
	{
		name: "bigdata-investment-memo",
		description: "Produce an investment memo with thesis, variant perception, valuation, risks, and catalysts.",
		workflow: "investment memo",
		targetKind: "company or security",
		defaultTargetQuestion: "which company or security they want analyzed",
		requiresTarget: true,
	},
	{
		name: "bigdata-earnings-preview",
		description: "Create a forward-looking pre-earnings analysis with recent developments, bull/base/bear cases, and key metrics to watch.",
		workflow: "earnings preview",
		targetKind: "company or security",
		defaultTargetQuestion: "which company or security they want analyzed",
		requiresTarget: true,
	},
	{
		name: "bigdata-earnings-digest",
		description: "Analyze the latest earnings results, segment performance, guidance, and surprises.",
		workflow: "earnings digest",
		targetKind: "company or security",
		defaultTargetQuestion: "which company or security they want analyzed",
		requiresTarget: true,
	},
	{
		name: "bigdata-earnings-reaction",
		description: "Generate a post-earnings reaction note covering results versus expectations, guidance changes, sentiment, and revised view.",
		workflow: "earnings reaction",
		targetKind: "company or security",
		defaultTargetQuestion: "which company or security they want analyzed",
		requiresTarget: true,
	},
	{
		name: "bigdata-earnings-quality-screen",
		description: "Run an earnings quality screen covering cash conversion, accruals, and accounting red flags.",
		workflow: "earnings quality screen",
		targetKind: "company or security",
		defaultTargetQuestion: "which company or security they want analyzed",
		requiresTarget: true,
	},
	{
		name: "bigdata-valuation-snapshot",
		description: "Build a valuation snapshot with key assumptions, bull/base/bear scenarios, and probability-weighted value.",
		workflow: "valuation snapshot",
		targetKind: "company or security",
		defaultTargetQuestion: "which company or security they want analyzed",
		requiresTarget: true,
	},
	{
		name: "bigdata-peer-comparables",
		description: "Compare a company against peers on valuation, growth, profitability, and sentiment.",
		workflow: "peer comparables",
		targetKind: "company or security",
		defaultTargetQuestion: "which company or security they want analyzed",
		requiresTarget: true,
	},
	{
		name: "bigdata-scenario-analysis",
		description: "Build bull, base, and bear cases with assumptions, probabilities, and expected value implications.",
		workflow: "scenario analysis",
		targetKind: "company or security",
		defaultTargetQuestion: "which company or security they want analyzed",
		requiresTarget: true,
	},
	{
		name: "bigdata-variant-perception",
		description: "Define explicit variant perception versus consensus using fundamentals, valuation, and sentiment framing.",
		workflow: "variant perception",
		targetKind: "company or security",
		defaultTargetQuestion: "which company or security they want analyzed",
		requiresTarget: true,
	},
	{
		name: "bigdata-risk-assessment",
		description: "Create a risk analysis covering regulatory, competitive, operational, financial, and macro risks.",
		workflow: "risk assessment",
		targetKind: "company or security",
		defaultTargetQuestion: "which company or security they want analyzed",
		requiresTarget: true,
	},
	{
		name: "bigdata-moat-governance-review",
		description: "Assess competitive moat durability and management quality, including capital allocation and governance risks.",
		workflow: "moat and governance review",
		targetKind: "company or security",
		defaultTargetQuestion: "which company or security they want analyzed",
		requiresTarget: true,
	},
	{
		name: "bigdata-country-analysis",
		description: "Generate a country economic analysis covering GDP, inflation, monetary policy, labor markets, and investment implications.",
		workflow: "country analysis",
		targetKind: "country",
		defaultTargetQuestion: "which country they want analyzed",
		requiresTarget: true,
	},
	{
		name: "bigdata-regional-comparison",
		description: "Compare regions on economic indicators, market performance, and allocation implications.",
		workflow: "regional comparison",
		targetKind: "regions",
		defaultTargetQuestion: "which regions they want compared",
		requiresTarget: true,
	},
	{
		name: "bigdata-g7-comparison",
		description: "Compare G7 economies across growth, inflation, policy, market positioning, and investment implications.",
		workflow: "G7 comparison",
		targetKind: "optional asset-class focus",
		defaultTargetQuestion: "whether they want a specific asset-class or sector focus",
	},
	{
		name: "bigdata-country-sector-analysis",
		description: "Analyze a sector in a country or region, covering economic backdrop, sector trends, and company fundamentals.",
		workflow: "country-sector analysis",
		targetKind: "sector and country or region",
		defaultTargetQuestion: "which sector and country or region they want analyzed",
		requiresTarget: true,
	},
	{
		name: "bigdata-cross-sector",
		description: "Compare sectors on valuations, earnings growth, and cycle positioning.",
		workflow: "cross-sector comparison",
		targetKind: "sectors",
		defaultTargetQuestion: "which sectors they want compared",
		requiresTarget: true,
	},
	{
		name: "bigdata-sector-analysis",
		description: "Analyze a sector's performance, valuations, themes, sub-industries, and upcoming catalysts.",
		workflow: "sector analysis",
		targetKind: "sector",
		defaultTargetQuestion: "which sector they want analyzed",
		requiresTarget: true,
	},
	{
		name: "bigdata-sector-playbook",
		description: "Create a sector investment playbook with key KPIs, debates, valuation context, and setup.",
		workflow: "sector playbook",
		targetKind: "sector",
		defaultTargetQuestion: "which sector they want analyzed",
		requiresTarget: true,
	},
	{
		name: "bigdata-thematic-research",
		description: "Research a macro investment theme with sector impact, beneficiaries, and implementation ideas.",
		workflow: "thematic research",
		targetKind: "theme",
		defaultTargetQuestion: "which theme they want researched",
		requiresTarget: true,
	},
	{
		name: "bigdata-pre-ipo-analysis",
		description: "Produce a balanced pre-IPO research note for an upcoming listing.",
		workflow: "pre-IPO analysis",
		targetKind: "upcoming IPO company",
		defaultTargetQuestion: "which upcoming IPO they want analyzed",
		requiresTarget: true,
		extraInstruction: "Use the private-company pre-IPO workflow and avoid buy, avoid, trading, or portfolio action calls.",
	},
	{
		name: "bigdata-post-ipo-day1",
		description: "Create a first-trading-day post-IPO reaction note.",
		workflow: "post-IPO day-1 reaction note",
		targetKind: "recently listed company",
		defaultTargetQuestion: "which recently listed company they want analyzed",
		requiresTarget: true,
		extraInstruction: "Follow the post-IPO day-1 workflow and keep the output balanced without buy, avoid, trading, or portfolio action calls.",
	},
	{
		name: "bigdata-post-ipo-day14",
		description: "Create a day-14 post-IPO note on potential NASDAQ-100 fast-track inclusion.",
		workflow: "post-IPO day-14 NASDAQ-100 inclusion note",
		targetKind: "recently listed large-cap company",
		defaultTargetQuestion: "which recently listed company they want analyzed",
		requiresTarget: true,
		extraInstruction: "Verify current Nasdaq index methodology and effective dates; do not assume eligibility rules.",
	},
	{
		name: "bigdata-post-ipo-day179",
		description: "Create a day-179 note on 180-day lock-up expiry and float expansion.",
		workflow: "post-IPO day-179 lock-up expiry note",
		targetKind: "company approaching its 180-day lock-up",
		defaultTargetQuestion: "which company they want analyzed",
		requiresTarget: true,
		extraInstruction: "Confirm lock-up terms and expiry date from filings before analyzing the overhang.",
	},
	{
		name: "bigdata-post-ipo-day365",
		description: "Create a day-365 note on founder or significant-investor lock-up expiry and float expansion.",
		workflow: "post-IPO day-365 lock-up and float-expansion note",
		targetKind: "company approaching its founder or significant-investor lock-up expiry",
		defaultTargetQuestion: "which company they want analyzed",
		requiresTarget: true,
		extraInstruction: "Confirm the staggered lock-up structure from filings before analyzing supply and reweighting effects.",
	},
]

function buildPrompt(command: ResearchCommand, input: string): string {
	const target = input.trim()
	const targetInstruction =
		target.length > 0
			? `Target or focus (${command.targetKind}): ${target}.`
			: command.requiresTarget
				? `No target was provided. Ask the user ${command.defaultTargetQuestion} before using Bigdata.com MCP tools.`
				: `No target was provided. Ask one concise clarifying question about ${command.defaultTargetQuestion} if the research scope is ambiguous.`

	return [
		`Create a ${command.workflow} using the bigdata-financial-research-analyst skill.`,
		targetInstruction,
		command.extraInstruction,
		"Use Bigdata.com MCP tools for factual market, company, macro, news, events, transcript, filing, sentiment, and calendar context when needed.",
		"Separate facts from analysis, cite the evidence source in plain language, and include Bigdata.com attribution when Bigdata MCP data is used.",
		"Do not present outputs as personalized financial advice. Do not recommend position sizing, trading actions, or portfolio actions.",
		"Markdown in chat is the default. Ask before generating, saving, or exporting formal report files.",
	]
		.filter(Boolean)
		.join("\n")
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
