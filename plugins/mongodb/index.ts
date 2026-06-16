import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import type { AgentPlugin } from "@cline/sdk"

const MODULE_DIR = dirname(fileURLToPath(import.meta.url))
const MONGODB_MCP_BIN =
	process.platform === "win32" ? "mongodb-mcp-server.cmd" : "mongodb-mcp-server"

const plugin: AgentPlugin = {
	name: "mongodb",
	manifest: {
		capabilities: ["mcp", "skills"],
	},

	setup(api) {
		api.registerMcpServer({
			name: "mongodb",
			transport: {
				type: "stdio",
				command: join(MODULE_DIR, "node_modules", ".bin", MONGODB_MCP_BIN),
				cwd: MODULE_DIR,
			},
			env: {
				MDB_MCP_READ_ONLY: {
					fromEnv: "MDB_MCP_READ_ONLY",
					value: "true",
				},
			},
			metadata: {
				description:
					"Connect to MongoDB deployments, inspect schemas and indexes, run read-only database workflows by default, and use Atlas administration tools when configured.",
			},
		})
	},
}

export default plugin
