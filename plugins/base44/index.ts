import type { AgentPlugin } from "@cline/sdk"

const safetyRule = [
	"Base44 safety and conventions:",
	"- Prefer local project inspection and bundled skill references before external documentation.",
	"- Do not run Base44 CLI commands, install packages, create apps, scaffold files, link projects, push resources, deploy sites/functions, open dashboards, read logs, or manage secrets without explicit user approval.",
	"- Use project-local CLI execution such as `npx base44 ...`; do not assume a global `base44` binary.",
	"- Treat Base44 app IDs, access tokens, refresh tokens, connector credentials, secrets, dashboard URLs, production logs, user data, and uploaded files as sensitive.",
	"- Never place service-role credentials or connector tokens in frontend code. Keep auth, user-scoped SDK calls, and service-role code paths separate.",
	"- For existing projects, inspect `base44/config.jsonc`, resource files, generated types, and the existing SDK client before changing code.",
].join("\n")

const plugin: AgentPlugin = {
	name: "base44",
	manifest: {
		capabilities: ["skills", "rules"],
	},
	setup(api) {
		api.registerRule({
			id: "base44:safety",
			source: "base44",
			content: safetyRule,
		})
	},
}

export default plugin
