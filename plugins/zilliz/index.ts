import type { AgentPlugin } from "@cline/sdk"

const PLUGIN_NAME = "zilliz"

const safetyRule = [
	"Zilliz and Milvus workflow safety:",
	"- Treat Zilliz Cloud resource metadata, query results, vector data, logs, billing details, and CLI output as private user data unless the user explicitly says otherwise.",
	"- Ask for explicit user approval before installing or upgrading `zilliz-cli`, running authentication commands, changing shell profiles, writing credentials, or modifying persistent CLI configuration.",
	"- Ask for explicit user approval before create, update, delete, drop, load, release, suspend, resume, restore, import, backup, role, user, password, PrivateLink, volume, project, cluster, collection, partition, index, alias, vector insert, vector upsert, or vector delete operations.",
	"- For cost-affecting operations such as cluster creation, scaling, plan upgrades, restores, imports, auto-scaling, on-demand clusters, and volume changes, confirm the target project, region, resource names, expected cost or quota impact, and whether the user wants the action executed now.",
	"- Never ask the user to paste API keys, passwords, or bearer tokens into chat. Have them authenticate in their own terminal or environment, then verify with read-only status commands.",
	"- Prefer `--output json` for inventory and status checks. Do not run broad data scans, exports, or vector queries unless the scope is directly tied to the user's request.",
].join("\n")

const plugin: AgentPlugin = {
	name: PLUGIN_NAME,
	manifest: {
		capabilities: ["skills", "rules"],
	},

	setup(api) {
		api.registerRule({
			id: "zilliz:safety",
			source: PLUGIN_NAME,
			content: safetyRule,
		})

	},
}

export default plugin
