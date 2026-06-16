import type { AgentPlugin } from "@cline/sdk"

function buildReviewPrompt(input: string): string {
	const target = input.trim() || "the current workspace"
	return [
		`Review ${target} for Azure Cosmos DB best practices.`,
		"Use the cosmosdb-best-practices skill.",
		"Prioritize findings in this order: data model design, partition key choice, CosmosClient lifecycle, query efficiency, SDK retry/connection patterns, indexing, throughput, global distribution, monitoring, and vector search.",
		"For each finding, include severity, evidence from the code, impact on RU cost, latency, or scalability, and a concrete fix.",
		"Do not connect to a live Azure Cosmos DB account, sample documents, read production diagnostics, change throughput, change indexes, print secrets, or perform destructive actions unless the user explicitly approves that separately.",
	].join("\n")
}

const plugin: AgentPlugin = {
	name: "azure-cosmos-db-assistant",
	manifest: {
		capabilities: ["commands", "skills"],
	},

	setup(api) {
		api.registerCommand({
			name: "cosmos-review",
			description: "Review code for Azure Cosmos DB best practices.",
			handler(input) {
				const submitPrompt = buildReviewPrompt(input)
				return {
					reply: "Starting an Azure Cosmos DB best-practices review.",
					submitPrompt,
				}
			},
		})
	},
}

export default plugin
