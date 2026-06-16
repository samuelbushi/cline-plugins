import type { AgentPlugin } from "@cline/core";

const plugin: AgentPlugin = {
	name: "laravel-boost",
	manifest: {
		capabilities: ["mcp"],
	},

	setup(api, ctx) {
		const workspaceRoot = ctx.workspaceInfo?.rootPath?.trim();
		if (!workspaceRoot) {
			throw new Error(
				"laravel-boost requires a workspace root so it can run php artisan boost:mcp from the Laravel application.",
			);
		}

		api.registerMcpServer({
			name: "laravel-boost",
			transport: {
				type: "stdio",
				command: "php",
				args: ["artisan", "boost:mcp"],
				cwd: workspaceRoot,
			},
			metadata: {
				description:
					"Expose Laravel Boost MCP tools from the current Laravel application.",
			},
		});
	},
};

export { plugin };
export default plugin;
