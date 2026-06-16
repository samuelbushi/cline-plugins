import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import type { AgentPlugin } from "@cline/sdk"

const pluginDir = dirname(fileURLToPath(import.meta.url))
const context7ServerPath = join(
	pluginDir,
	"node_modules",
	"@upstash",
	"context7-mcp",
	"dist",
	"index.js",
)

const plugin: AgentPlugin = {
	name: "context7",
	manifest: {
		capabilities: ["mcp"],
	},
	setup(api) {
		api.registerMcpServer({
			name: "context7",
			transport: {
				type: "stdio",
				command: "node",
				args: [context7ServerPath],
			},
		})
	},
}

export default plugin
