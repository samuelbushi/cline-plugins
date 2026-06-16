---
name: cosmosdb-best-practices
description: Use this skill when designing, writing, reviewing, or refactoring Azure Cosmos DB applications, especially for data modeling, partition keys, queries, SDK usage, indexing, throughput, global distribution, monitoring, design patterns, and vector search.
---

# Azure Cosmos DB Best Practices

Use this skill for Azure Cosmos DB NoSQL API guidance and code review.

## Review Order

1. Data model design: document shape, embed vs reference, item size, schema versioning, type discriminators, JSON serialization, relationship hydration.
2. Partition key design: high cardinality, query alignment, hotspot avoidance, hierarchical partition keys, synthetic keys, partition key length, logical partition growth.
3. SDK usage: singleton client lifecycle, async APIs, retry-after handling for 429 responses, direct mode for production, preferred and excluded regions, diagnostics, ETags, local emulator configuration.
4. Query efficiency: avoid scans, minimize cross-partition queries, project only needed fields, parameterize queries, page with continuation tokens, align filters and ORDER BY with indexes.
5. Indexing: exclude unused paths, add composite indexes for common ORDER BY patterns, configure spatial indexes only when needed, understand index type and consistency tradeoffs.
6. Throughput and scaling: choose serverless, autoscale, or provisioned throughput based on workload shape; right-size RU/s; decide database vs container throughput deliberately.
7. Global distribution: choose consistency level, read regions, multi-region writes, automatic failover, zone redundancy, and conflict resolution based on business requirements.
8. Monitoring: track RU consumption, throttling, latency, diagnostics, Azure Monitor integration, and alert thresholds.
9. Design patterns: Change Feed for materialized views, service-layer hydration for references, cached or count-based ranking patterns.
10. Vector search: feature enablement, vector embedding policy, index type, `VectorDistance()` queries, normalized embeddings for cosine similarity, and repository patterns.

## Code Review Output

For each finding, include:

1. Severity: Critical, High, Medium, or Low.
2. Evidence: specific files, code, queries, or configuration.
3. Impact: RU cost, latency, scalability, availability, correctness, or maintainability.
4. Recommendation: a concrete fix with code or configuration when useful.
5. Validation: how the user can verify the improvement safely.

## Guardrails

- Ask before connecting to a live Azure Cosmos DB account, querying data, sampling documents, reading production diagnostics, changing indexes, changing throughput, or running migrations.
- Do not expose account keys, connection strings, JWT tokens, document samples, customer data, or full resource identifiers.
- Prefer static code and configuration review before live inspection.
- If live inspection is approved, start with read-only metadata and narrow queries.

## Topic Checklist

Use these checks when the user asks for broad review:

- Data model keeps frequently read data together while avoiding unbounded arrays and item growth near the 2 MB item limit.
- Partition key has high cardinality, avoids hot tenants or timestamps, and matches the most important query patterns.
- CosmosClient is reused as a singleton and configured for production connection mode, retries, preferred regions, and diagnostics.
- Queries are parameterized, scoped to partitions when possible, use projections, and avoid full container scans.
- Indexing policy supports known filters and sort orders without indexing unused high-cardinality or large fields unnecessarily.
- Throughput mode and RU/s match the workload's traffic pattern, environments, and cost expectations.
- Global distribution choices match consistency, failover, write-region, and latency requirements.
- Monitoring captures RU usage, 429s, latency percentiles, diagnostics, and relevant Azure Monitor alerts.
- Vector search configuration matches embedding dimensions, distance metric, index type, and query pattern.
