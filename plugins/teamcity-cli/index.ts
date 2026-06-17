import type { AgentPlugin } from "@cline/sdk"

const teamcitySafetyRule = [
	"TeamCity CLI workflows can read CI data, mutate server state, start or cancel builds, edit pipelines, manage secrets, and open remote agent shells.",
	"When using the teamcity CLI, prefer read-only discovery first: auth status, list, view, log, tests, changes, tree, and validate commands.",
	"Ask for explicit user confirmation before TeamCity mutations: run start/restart/cancel/pin/unpin/tag/untag/comment, queue approve/remove/top, job/project/parameter edits, connection/VCS/pool/agent changes, project token put/get, pipeline create/push/delete, raw API writes, artifact downloads outside a temp or user-approved path, or remote agent exec/term/reboot.",
	"Do not paste or print TeamCity tokens, GitHub personal access tokens, Docker registry passwords, or retrieved secure-token values. Prefer stdin, service accounts, TeamCity project tokens, and GitHub App connections.",
	"Never delete or skip tests, disable linting/static analysis, commit, push, force-push, or repeat the same CI fix loop without explicit user approval and a fresh diagnosis.",
].join("\n")

const plugin: AgentPlugin = {
	name: "teamcity-cli",
	manifest: {
		capabilities: ["skills", "rules"],
	},
	setup(api) {
		api.registerRule({
			id: "teamcity-cli-safety",
			source: "teamcity-cli",
			content: teamcitySafetyRule,
		})
	},
}

export default plugin
