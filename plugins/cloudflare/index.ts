import type { AgentPlugin } from "@cline/sdk"

const mcpServers = [
	{
		name: "cloudflare-api",
		description: "Manage Cloudflare account resources, zones, and settings.",
		url: "https://mcp.cloudflare.com/mcp",
	},
	{
		name: "cloudflare-docs",
		description: "Search and retrieve current Cloudflare documentation.",
		url: "https://docs.mcp.cloudflare.com/mcp",
	},
	{
		name: "cloudflare-bindings",
		description:
			"Build Workers applications with Cloudflare storage, AI, and compute bindings.",
		url: "https://bindings.mcp.cloudflare.com/mcp",
	},
	{
		name: "cloudflare-builds",
		description: "Inspect and manage Workers builds.",
		url: "https://builds.mcp.cloudflare.com/mcp",
	},
	{
		name: "cloudflare-observability",
		description: "Debug Cloudflare application logs, traces, and analytics.",
		url: "https://observability.mcp.cloudflare.com/mcp",
	},
] as const

function commandPrompt(kind: "agent" | "mcp", input: string): string {
	const request = input.trim()
	const heading =
		kind === "agent"
			? "Build an AI agent on Cloudflare using the Agents SDK."
			: "Build a remote MCP server on Cloudflare using McpAgent."
	const skill =
		kind === "agent" ? "agents-sdk" : "agents-sdk and Cloudflare MCP docs"
	const checklist =
		kind === "agent"
			? [
					"Use the agents-sdk, cloudflare, wrangler, durable-objects, and workers-best-practices skills as relevant.",
					"Start by checking the existing project shape and asking what should be scaffolded versus edited.",
					"Retrieve current Cloudflare Agents documentation before relying on API details.",
					"Plan wrangler config, Durable Object bindings, migrations, routing, state, streaming, and deploy steps before writing code.",
				]
			: [
					"Use the agents-sdk, cloudflare, wrangler, and workers-best-practices skills as relevant.",
					"Retrieve current Cloudflare MCP and Agents documentation before relying on API details.",
					"Plan McpAgent class structure, MCP tools, transport path, OAuth or auth boundary, wrangler config, and deploy steps before writing code.",
					"Do not expose secrets in code or logs, and gate deployment behind explicit user confirmation.",
				]

	return [
		heading,
		"",
		request ? `User request: ${request}` : "User request: ask what to build first.",
		"",
		`Load the ${skill} guidance first.`,
		...checklist.map((item) => `- ${item}`),
	].join("\n")
}

const workersRule = [
	"Cloudflare Workers guidance:",
	"When building or reviewing Workers, Pages Functions, Durable Objects, D1, KV, R2, Queues, Vectorize, Workers AI, Agents SDK, or Wrangler config, retrieve current Cloudflare documentation before relying on memory.",
	"Use Cloudflare bindings from wrangler config as the source of truth, generate or refresh types after binding changes, and never hardcode secrets in source or config.",
].join("\n")

const plugin: AgentPlugin = {
	name: "cloudflare",
	manifest: {
		capabilities: ["mcp", "commands", "rules", "skills"],
	},

	setup(api) {
		for (const server of mcpServers) {
			api.registerMcpServer({
				name: server.name,
				transport: {
					type: "streamableHttp",
					url: server.url,
				},
				metadata: {
					description: server.description,
				},
			})
		}

		api.registerCommand({
			name: "cloudflare-build-agent",
			description: "Plan and build an AI agent on Cloudflare using the Agents SDK.",
			handler: (input) => ({
				submitPrompt: commandPrompt("agent", input),
			}),
		})

		api.registerCommand({
			name: "cloudflare-build-mcp",
			description: "Plan and build a remote MCP server on Cloudflare using McpAgent.",
			handler: (input) => ({
				submitPrompt: commandPrompt("mcp", input),
			}),
		})

		api.registerRule({
			id: "cloudflare:workers-current-docs",
			source: "cloudflare",
			content: workersRule,
		})
	},
}

export default plugin
