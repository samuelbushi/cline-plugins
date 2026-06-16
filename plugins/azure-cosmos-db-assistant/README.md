# azure-cosmos-db-assistant

Azure Cosmos DB review guidance for data modeling, partition keys, query efficiency, SDK usage, indexing, throughput, global distribution, monitoring, design patterns, and vector search.

## What It Adds

- `cosmosdb-best-practices` skill for designing, writing, and reviewing Azure Cosmos DB applications.
- `/cosmos-review` slash command that submits a focused review prompt for the current workspace or a path the user provides.

This plugin does not register a live Cosmos DB MCP server. Live database operations require user-specific service deployment and short-lived authentication, so they should be configured explicitly through the user's normal Cline MCP settings when needed.

## Requirements

- No API keys, Azure account, or local binaries are required for best-practices review.
- Live account inspection is optional and should be configured separately by the user if they have an Azure Cosmos DB MCP Toolkit deployment.

## Trust Boundaries

- Ask before querying a live Azure Cosmos DB account, sampling documents, running vector searches, changing throughput, changing indexes, or reading production diagnostics.
- Do not print account keys, connection strings, JWT tokens, document samples, customer data, or full resource identifiers unless the user explicitly asks.
- Prefer code and configuration review first. Treat live database information as optional context that requires explicit approval.
