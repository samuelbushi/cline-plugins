import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import type { AgentPlugin } from "@cline/sdk"

const pluginDir = dirname(fileURLToPath(import.meta.url))
const serverDir = join(pluginDir, "mcp-servers", "domino_mcp_server")

const plugin: AgentPlugin = {
	name: "domino",
	manifest: {
		capabilities: ["mcp", "rules", "skills"],
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
	},
}

export default plugin
