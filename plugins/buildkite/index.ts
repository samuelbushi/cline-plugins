import type { AgentPlugin } from "@cline/sdk"

const PLUGIN_NAME = "buildkite"

const plugin: AgentPlugin = {
	name: PLUGIN_NAME,
	manifest: {
		capabilities: ["mcp", "skills", "rules"],
	},

	setup(api) {
		api.registerMcpServer({
			name: "buildkite",
			transport: {
				type: "streamableHttp",
				url: "https://mcp.buildkite.com/mcp",
			},
		})

		api.registerRule({
			id: "buildkite:ci-operations-guardrails",
			source: PLUGIN_NAME,
			content: [
				"When using Buildkite workflows, treat build triggers, retries, cancellations, pipeline edits, secret changes, agent changes, and preflight runs as externally visible CI operations.",
				"Ask before starting or modifying CI work unless the user already gave clear approval for that exact action.",
				"Never print, commit, or paste Buildkite API tokens, agent tokens, cluster secrets, webhook secrets, OIDC tokens, job environment dumps, or sensitive build logs.",
				"Use least-privilege API token scopes and prefer OIDC or Buildkite-managed secrets over long-lived static credentials in pipelines.",
				"Before running preflight, explain that it can create a temporary commit, push a temporary branch, and start a remote Buildkite build.",
			].join("\n"),
		})
	},
}

export default plugin
