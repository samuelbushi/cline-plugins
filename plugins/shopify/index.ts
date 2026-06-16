import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import type { AgentPlugin } from "@cline/sdk"

const pluginDir = dirname(fileURLToPath(import.meta.url))
const shopifyServerPath = join(
	pluginDir,
	"node_modules",
	"@shopify",
	"dev-mcp",
	"dist",
	"index.js",
)

const plugin: AgentPlugin = {
	name: "shopify",
	manifest: {
		capabilities: ["mcp"],
	},
	setup(api) {
		api.registerMcpServer({
			name: "shopify-mcp",
			transport: {
				type: "stdio",
				command: "node",
				args: [shopifyServerPath],
			},
		})
	},
}

export default plugin
