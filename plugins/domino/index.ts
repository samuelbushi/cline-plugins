import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import type { AgentPlugin } from "@cline/sdk"

const pluginDir = dirname(fileURLToPath(import.meta.url))
const serverDir = join(pluginDir, "mcp-servers", "domino_mcp_server")

const commands = [
	{
		name: "domino-app-init",
		description:
			"Initialize a Domino-ready web app using the bundled app deployment and UI bootstrap guidance.",
		skill: "domino-ui-bootstrap",
		intent:
			"Initialize or update a Domino-ready web application. Choose the requested framework when provided, otherwise inspect the project and ask one concise question only if the framework is ambiguous.",
	},
	{
		name: "domino-debug-proxy",
		description:
			"Diagnose Domino web app proxy, port, host binding, asset path, and app.sh issues.",
		skill: "domino-app-deployment",
		intent:
			"Debug Domino app proxy and routing issues. Inspect relevant app configuration files before proposing fixes, and ask before applying edits.",
	},
	{
		name: "domino-experiment-setup",
		description:
			"Set up Domino-compatible MLflow experiment tracking for a machine learning project.",
		skill: "domino-experiment-tracking",
		intent:
			"Set up Domino MLflow experiment tracking. Use unique experiment names, Domino context tags, and framework-specific autologging when appropriate.",
	},
	{
		name: "domino-trace-setup",
		description:
			"Set up Domino GenAI tracing for an LLM, agent, or evaluation workflow.",
		skill: "domino-genai-tracing",
		intent:
			"Set up Domino GenAI tracing. Use the Domino tracing guidance and bundled tracing templates when helpful, and avoid committing secrets.",
	},
]

function commandPrompt(skill: string, intent: string, input: string): string {
	const trimmed = input.trim()
	return [
		`Use the ${skill} Domino skill.`,
		intent,
		trimmed ? `User input: ${trimmed}` : undefined,
	]
		.filter(Boolean)
		.join("\n")
}

const plugin: AgentPlugin = {
	name: "domino",
	manifest: {
		capabilities: ["commands", "mcp", "rules", "skills"],
	},
	setup(api) {
		api.registerMcpServer({
			name: "domino",
			transport: {
				type: "stdio",
				command: "uv",
				args: ["--directory", serverDir, "run", "domino_mcp_server.py"],
				cwd: serverDir,
			},
			metadata: {
				description:
					"Run Domino jobs, inspect job status and output, and sync files with Domino DFS projects.",
				requirements: ["uv", "Python 3.11+", "Domino workspace or DOMINO_HOST and DOMINO_API_KEY"],
			},
		})

		api.registerRule({
			id: "domino:operational-safety",
			source: "domino",
			content: [
				"When using Domino plugin guidance or MCP tools, treat remote jobs, project file uploads, forced overwrites, app deployments, model endpoint changes, governance or taxonomy writes, cloud/Kubernetes changes, and CI/CD secret setup as user-confirmed operations.",
				"Read local files with normal Cline file tools before passing explicit file content to Domino MCP upload/sync tools. Do not ask the Domino MCP server to discover arbitrary local files.",
				"Do not print Domino API keys, local tokens, OAuth tokens, or service credentials. Prefer environment variables or documented secret stores for credentials.",
				"For Git-backed Domino projects, prefer normal Git workflows over DFS file sync tools.",
			].join("\n"),
		})

		for (const command of commands) {
			api.registerCommand({
				name: command.name,
				description: command.description,
				handler: (input) => ({
					submitPrompt: commandPrompt(command.skill, command.intent, input),
				}),
			})
		}
	},
}

export default plugin
