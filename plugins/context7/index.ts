import type { AgentPlugin } from "@cline/core";

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
				command: "npx",
				args: ["-y", "@upstash/context7-mcp"],
			},
		});
	},
};

export default plugin;
