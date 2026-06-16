import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "serena",
	manifest: {
		capabilities: ["mcp"],
	},

	setup(api, ctx) {
		const workspaceRoot = ctx.workspaceInfo?.rootPath
		if (!workspaceRoot) {
			return
		}

		api.registerMcpServer({
			name: "serena",
			transport: {
				type: "stdio",
				command: "uvx",
				args: [
					"--from",
					"serena-agent==1.5.3",
					"serena",
					"start-mcp-server",
				],
				cwd: workspaceRoot,
			},
			metadata: {
				description:
					"Semantic code analysis, symbol-aware codebase navigation, and refactoring assistance for the current workspace.",
			},
		})
	},
}

export default plugin
