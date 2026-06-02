import { type AgentPlugin, createTool } from "@cline/sdk"

const bundledSkillsInfoTool = createTool({
	name: "bundled_skills_info",
	description:
		"Return information about the bundled skills demo plugin. Use this when verifying that the plugin itself loaded, separate from the bundled skills.",
	inputSchema: {
		type: "object",
		properties: {},
		additionalProperties: false,
	},
	execute: async () => {
		return {
			plugin: "bundled-skills-demo",
			bundledSkills: ["plugin-skill-smoke-test"],
			smokeTestExpectedResponse: "PLUGIN_BUNDLED_SKILL_EXAMPLE_OK",
		}
	},
})

const plugin: AgentPlugin = {
	name: "bundled-skills-demo",
	manifest: {
		capabilities: ["tools"],
	},

	setup(api) {
		api.registerTool(bundledSkillsInfoTool)
	},
}

export default plugin
