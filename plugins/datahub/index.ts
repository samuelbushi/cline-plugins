import type { AgentPlugin } from "@cline/sdk"

function skillPrompt(skill: string, input: string): string {
	const request = input.trim()
	return [
		`Use the ${skill} skill for this DataHub request.`,
		request ? `User request: ${request}` : "If the request is missing, ask what the user wants to do.",
	].join("\n\n")
}

const commands = [
	{
		name: "datahub-search",
		description: "Search the DataHub catalog and answer metadata questions.",
		skill: "datahub-search",
	},
	{
		name: "datahub-enrich",
		description: "Plan and apply DataHub metadata updates after user approval.",
		skill: "datahub-enrich",
	},
	{
		name: "datahub-lineage",
		description: "Trace DataHub lineage and run impact analysis.",
		skill: "datahub-lineage",
	},
	{
		name: "datahub-quality",
		description: "Inspect and manage DataHub assertions, incidents, and quality status.",
		skill: "datahub-quality",
	},
	{
		name: "datahub-setup",
		description: "Install the DataHub CLI, configure auth, and verify connectivity.",
		skill: "datahub-setup",
	},
	{
		name: "datahub-connector-plan",
		description: "Plan a new DataHub ingestion connector.",
		skill: "datahub-connector-planning",
	},
	{
		name: "datahub-connector-review",
		description: "Review DataHub connector code against connector standards.",
		skill: "datahub-connector-pr-review",
	},
	{
		name: "datahub-load-standards",
		description: "Load DataHub connector standards into context.",
		skill: "load-standards",
	},
	{
		name: "datahub-mfe-create-app",
		description: "Scaffold a DataHub Micro Frontend app after preview and approval.",
		skill: "datahub-mfe-create-app",
	},
	{
		name: "datahub-mfe-configure-app",
		description: "Configure DataHub to load a Micro Frontend app after preview and approval.",
		skill: "datahub-mfe-configure-app",
	},
] as const

const plugin: AgentPlugin = {
	name: "datahub",
	manifest: {
		capabilities: ["skills", "commands"],
	},
	setup(api) {
		for (const command of commands) {
			api.registerCommand({
				name: command.name,
				description: command.description,
				handler: (input) => ({
					reply: `Starting ${command.skill}.`,
					submitPrompt: skillPrompt(command.skill, input),
				}),
			})
		}
	},
}

export default plugin
