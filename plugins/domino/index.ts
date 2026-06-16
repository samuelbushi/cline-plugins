import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import type { AgentPlugin } from "@cline/sdk"

const pluginDir = dirname(fileURLToPath(import.meta.url))
const serverDir = join(pluginDir, "mcp-servers", "domino_mcp_server")

const plugin: AgentPlugin = {
	name: "domino",
	manifest: {
		capabilities: ["mcp", "skills"],
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
	},
}

export default plugin
