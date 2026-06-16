import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "redis-development",
	manifest: {
		capabilities: ["skills", "rules"],
	},

	setup(api) {
		api.registerRule({
			id: "redis-development:live-data-safety",
			source: "redis-development",
			content: [
				"Redis development guidance can involve production data, customer prompts, memory records, credentials, and destructive administrative commands.",
				"Before running Redis commands or Redis Cloud SDK/REST calls against a live service, confirm the target environment, host, database, key pattern, cache ID, memory store ID, tenant/user scope, and whether the action can mutate data, delete data, bulk-read sensitive data, trigger a write-side smoke test, or block the server.",
				"Ask before using destructive, broad, blocking, or administrative operations such as FLUSHALL, FLUSHDB, CONFIG SET, DEBUG, KEYS, FT.DROPINDEX, ACL SETUSER, SLOWLOG RESET, DEL over broad patterns, Agent Memory writes/deletes, LangCache writes, production smoke tests, or production firewall/auth changes.",
				"Prefer bounded scans, read-only inspection, staging environments, explicit key prefixes, synthetic test stores/caches, and non-production smoke tests when diagnosing Redis systems.",
				"Do not write Redis passwords, ACL credentials, Redis Cloud API keys, Agent Memory API keys, LangCache API keys, connection strings, customer prompts, session history, or memory records into source-controlled files.",
			].join("\n"),
		})
	},
}

export default plugin
