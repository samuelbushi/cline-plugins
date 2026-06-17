import type { AgentPlugin } from "@cline/sdk";

const PLUGIN_NAME = "vibe-prospecting";

const plugin: AgentPlugin = {
	name: PLUGIN_NAME,
	manifest: {
		capabilities: ["skills", "rules"],
	},

	setup(api) {
		api.registerRule({
			id: `${PLUGIN_NAME}:prospecting-safety`,
			source: PLUGIN_NAME,
			content: [
				"Vibe Prospecting is available for B2B company/contact research through its bundled skill.",
				"Do not run `npx @vibeprospecting/vpai@latest`, install third-party packages, authenticate, fetch lead/contact data, enrich prospects, or export CSVs unless the user explicitly asks for Vibe Prospecting work.",
				"Before any full-scale prospecting run, follow the sample-first workflow in the skill: complete the same workflow on exactly five entities, present it as a sample, then wait for explicit user approval before scaling up.",
				"Treat prospect/contact records, emails, phone numbers, business events, and exported CSVs as sensitive business data. Do not send, upload, persist outside the workspace, or use for outreach without explicit user approval.",
			].join("\n"),
		});
	},
};

export default plugin;
