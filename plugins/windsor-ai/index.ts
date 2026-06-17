import type { AgentPlugin } from "@cline/sdk";

const PLUGIN_NAME = "windsor-ai";

function commandPrompt(title: string, body: string): string {
	return [`Windsor.ai ${title}`, "", body].join("\n");
}

const plugin: AgentPlugin = {
	name: PLUGIN_NAME,
	manifest: {
		capabilities: ["mcp", "skills", "commands", "rules"],
	},

	setup(api) {
		api.registerMcpServer({
			name: "windsor-ai",
			transport: {
				type: "streamableHttp",
				url: "https://mcp.windsor.ai",
			},
			metadata: {
				description:
					"Query Windsor.ai business data from marketing, sales, CRM, ecommerce, finance, and analytics connectors.",
			},
		});

		api.registerCommand({
			name: "campaign-report",
			description:
				"Generate a 30-day campaign performance report from a connected Windsor.ai source.",
			handler() {
				return {
					submitPrompt: commandPrompt(
						"campaign report",
						[
							"Use the Windsor.ai MCP tools to generate a campaign performance report.",
							"Call `get_connectors` first, ask which connector/account to use unless only one obvious account exists, then inspect available fields with `get_options` if needed.",
							"Query the last 30 days with campaign/date/spend/clicks/impressions/conversions/revenue when those fields exist, then present the top 25 campaigns sorted by spend descending plus totals for spend, clicks, and conversions.",
							"Ask before expanding beyond the top 25 or pulling row-level/customer/contact data.",
							"Do not write files or export data unless the user explicitly asks.",
						].join("\n"),
					),
				};
			},
		});

		api.registerCommand({
			name: "windsor-sources",
			description:
				"Show connected Windsor.ai data sources and the fields available from each.",
			handler() {
				return {
					submitPrompt: commandPrompt(
						"source overview",
						[
							"Use the Windsor.ai MCP tools to summarize connected data sources.",
							"Call `get_connectors`, then for connectors with accounts call `get_options` to inspect available fields.",
							"Present a concise overview with platform name, account IDs/names when available, approximate dimensions versus metrics, and a few representative fields.",
							"Keep the output scannable and avoid dumping full schemas unless the user asks.",
						].join("\n"),
					),
				};
			},
		});

		api.registerCommand({
			name: "windsor-types",
			description:
				"Generate TypeScript type definitions for a Windsor.ai connector schema.",
			handler(input) {
				const requestedConnector = input.trim();
				return {
					submitPrompt: commandPrompt(
						"TypeScript types",
						[
							requestedConnector
								? `Generate TypeScript types for the Windsor.ai connector: ${requestedConnector}.`
								: "Generate TypeScript types for a Windsor.ai connector. Ask which connector to use if the user has not already specified one.",
							"Use `get_connectors` first. Ask which account to use unless only one obvious account exists, because schema discovery requires account IDs.",
							"Use `get_options` and `get_fields` to inspect the schema for the selected connector/account.",
							"Generate a clear exported interface with JSDoc comments from field descriptions and TypeScript types mapped from Windsor field types.",
							"Before writing the file, propose the destination path such as `src/types/windsor-{connector}.ts` and wait for user approval.",
						].join("\n"),
					),
				};
			},
		});

		api.registerRule({
			id: `${PLUGIN_NAME}:business-data-safety`,
			source: PLUGIN_NAME,
			content: [
				"Windsor.ai exposes connected business data through the plugin-owned MCP server. Treat account IDs, marketing metrics, CRM records, ecommerce orders, finance data, and analytics exports as sensitive business data.",
				"Do not query Windsor.ai, pull large datasets, write exports, create fixtures from real records, or generate files from live data unless the user explicitly asked for that Windsor.ai workflow.",
				"Prefer aggregate, non-PII previews and schema inspection before broad queries. Ask before querying all sources, using large date ranges, joining multiple connectors, retrieving customer/contact/order-level rows, or writing any data-derived file to the workspace.",
				"Prefer synthetic or anonymized fixtures. If real records are required, get explicit approval and keep generated export/fixture files out of commits by default.",
			].join("\n"),
		});
	},
};

export default plugin;
