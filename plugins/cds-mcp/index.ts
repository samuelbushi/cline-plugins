import { createRequire } from "node:module"
import type { AgentPlugin } from "@cline/sdk"

const require = createRequire(import.meta.url)
const serverPath = require.resolve("@cap-js/mcp-server")

const plugin: AgentPlugin = {
	name: "cds-mcp",
	manifest: {
		capabilities: ["mcp"],
	},
	setup(api, ctx) {
		api.registerMcpServer({
			name: "cds-mcp",
			transport: {
				type: "stdio",
				command: "node",
				args: [serverPath],
				cwd: ctx.workspaceInfo?.rootPath ?? process.cwd(),
			},
		})
	},
}

export default plugin
