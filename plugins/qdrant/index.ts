import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
	name: "qdrant",
	manifest: {
		capabilities: ["skills", "rules"],
	},

	setup(api) {
		api.registerRule({
			id: "qdrant-operations-safety",
			source: "qdrant",
			content:
				"When working with Qdrant, treat collection deletes, shard changes, replica changes, payload index changes, quantization changes, embedding-model migrations, version upgrades, and live cluster resizing as production database operations. Prefer read-only diagnosis first, call out backup or rollback requirements, and ask the user before applying changes that mutate data, topology, search quality, cost, or availability.",
		})
	},
}

export default plugin
