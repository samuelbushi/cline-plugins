import type { AgentPlugin } from "@cline/core"

const rootlySafetyRule = `Rootly workflow safety:
- Use Rootly MCP tools for Rootly data. Do not call Rootly APIs with curl, wget, raw HTTP, or shell commands as a fallback.
- Treat incident records, alerts, timelines, private status updates, responder names, schedules, postmortems, and customer-impact details as sensitive operational data.
- Do not write Rootly API tokens, OAuth tokens, incident exports, alert payloads, private timelines, customer details, or responder schedules into source-controlled files.
- Ask for explicit confirmation before creating or updating incidents, incident events, action items, status-page updates, overrides, shift swaps, deployments, retrospectives, or any other write in Rootly.
- Ask before sending stakeholder-facing content, posting public updates, notifying responders, changing schedules, escalating incidents, or taking other responder-impacting actions.
- Keep Rootly lookups bounded. Avoid walking unbounded pagination, and stop to ask for a narrower incident, service, team, or time window when the result set is broad.
- If Rootly MCP tools are unavailable or unauthenticated, stop and explain that the user needs to connect the Rootly MCP server rather than attempting credential-based fallbacks.`

const plugin: AgentPlugin = {
	name: "rootly",
	manifest: {
		capabilities: ["mcp", "rules", "skills"],
	},

	setup(api) {
		api.registerMcpServer({
			name: "rootly",
			transport: {
				type: "streamableHttp",
				url: "https://mcp.rootly.com/mcp",
			},
		})

		api.registerRule({
			id: "rootly-safety",
			source: "plugin",
			content: rootlySafetyRule,
		})
	},
}

export default plugin
