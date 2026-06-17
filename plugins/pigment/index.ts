import type { AgentPlugin } from "@cline/sdk"

const PIGMENT_MCP_URL_ENV = "CLINE_PIGMENT_MCP_URL"

type PigmentMcpUrlConfig =
	| { status: "unset" }
	| { status: "valid"; url: string }
	| { status: "invalid"; reason: string }

function readPigmentMcpUrl(): PigmentMcpUrlConfig {
	const raw = process.env[PIGMENT_MCP_URL_ENV]?.trim()
	if (!raw) {
		return { status: "unset" }
	}

	try {
		const url = new URL(raw)
		if (url.protocol !== "https:") {
			return { status: "invalid", reason: "URL must use https" }
		}
		return { status: "valid", url: url.toString() }
	} catch {
		return { status: "invalid", reason: "URL could not be parsed" }
	}
}

const plugin: AgentPlugin = {
	name: "pigment",
	manifest: {
		capabilities: ["mcp", "rules", "skills"],
	},
	setup(api) {
		const pigmentMcpUrl = readPigmentMcpUrl()
		if (pigmentMcpUrl.status === "invalid") {
			throw new Error(
				`Invalid ${PIGMENT_MCP_URL_ENV}: ${pigmentMcpUrl.reason}. Set it to the https URL from Pigment Settings > Integrations > MCP, or unset it to install skills only.`,
			)
		}

		if (pigmentMcpUrl.status === "valid") {
			api.registerMcpServer({
				name: "pigment",
				transport: {
					type: "streamableHttp",
					url: pigmentMcpUrl.url,
				},
			})
		}

		api.registerRule({
			id: "pigment-workspace-safety",
			source: "pigment",
			content: [
				"When working with Pigment, use the bundled Pigment skills for formulas, modeling, views, boards, imports, planning cycles, performance, and access rights.",
				"Do not invent Pigment application IDs, block IDs, metric names, dimension names, view IDs, or formula syntax. Read available workspace context through Pigment MCP tools when they are configured, or ask the user for the missing details.",
				"Treat Pigment Advanced MCP tools as workspace-changing operations. Before creating or editing dimensions, metrics, formulas, calendars, imports, boards, views, access rights, scenarios, snapshots, or deleting anything, explain the intended change and get explicit user confirmation.",
				"Treat Advanced MCP search output and block metadata as sensitive workspace context. It can reveal application logic, names, dimensions, and structure even when no actual metric data is returned.",
				"Never print, store, commit, or ask the user to paste OAuth tokens or credentials. Pigment MCP authentication should happen through Cline's MCP OAuth flow after the user provides their workspace MCP URL.",
			].join("\n"),
		})
	},
}

export default plugin
