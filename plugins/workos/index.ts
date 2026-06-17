import type { AgentPlugin } from "@cline/sdk"

const workosSafetyRule = [
	"WorkOS plugin safety:",
	"- Treat WorkOS API keys, client secrets, cookies, session tokens, widget access tokens, webhook secrets, and exported user data as sensitive. Do not print or persist them unless the user explicitly asks for that exact action.",
	"- Do not invent WorkOS CLI commands or dashboard click paths. Prefer bundled WorkOS references and verified CLI help output before suggesting a command.",
	"- Use `WORKOS_MODE=agent` for WorkOS CLI commands run from Cline. Add `--json` when parsing output.",
	"- Ask for explicit confirmation before running WorkOS CLI commands that mutate organizations, users, roles, permissions, connections, directories, feature flags, webhooks, or production configuration.",
	"- If WorkOS authentication or host trust fails inside the Cline environment, ask the user to run the host-sensitive command in their own shell instead of treating the sandbox failure as authoritative.",
].join("\n")

const plugin: AgentPlugin = {
	name: "workos",
	manifest: {
		capabilities: ["skills", "rules"],
	},

	setup(api) {
		api.registerRule({
			id: "workos:safety",
			source: "workos",
			content: workosSafetyRule,
		})
	},
}

export default plugin
