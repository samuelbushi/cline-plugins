import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import type { AgentPlugin } from "@cline/sdk"

const pluginDir = dirname(fileURLToPath(import.meta.url))
const firebaseCliPath = join(
	pluginDir,
	"node_modules",
	"firebase-tools",
	"lib",
	"bin",
	"firebase.js",
)

function workspaceRootFromContext(ctx: unknown): string | undefined {
	const workspaceInfo = (ctx as { workspaceInfo?: { rootPath?: unknown } })
		.workspaceInfo
	const rootPath = workspaceInfo?.rootPath
	return typeof rootPath === "string" && rootPath.trim() ? rootPath : undefined
}

const plugin: AgentPlugin = {
	name: "firebase",
	manifest: {
		capabilities: ["mcp"],
	},
	setup(api, ctx) {
		const workspaceRoot = workspaceRootFromContext(ctx)
		api.registerMcpServer({
			name: "firebase",
			transport: {
				type: "stdio",
				command: "node",
				args: [
					firebaseCliPath,
					"mcp",
					...(workspaceRoot ? ["--dir", workspaceRoot] : []),
				],
				cwd: workspaceRoot ?? pluginDir,
			},
		})
	},
}

export default plugin
