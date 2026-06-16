---
name: clickhouse-best-practices
description: Review ClickHouse schemas, queries, ingestion plans, and MCP query workflows. Use when working with ClickHouse table design, ORDER BY keys, partitions, data types, joins, materialized views, inserts, updates, deletes, or SELECT queries through the ClickHouse MCP server.
---

# ClickHouse Best Practices

Use ClickHouse-specific judgment when designing schemas, reviewing SQL, or querying data. General row-store database intuition is often misleading for ClickHouse.

## Safe MCP Workflow

When using ClickHouse MCP tools:

1. Discover context first: organization, service, database, table, columns, comments, ORDER BY key, partition key, and indexes.
2. Plan the query around sort keys and available filters before executing SQL.
3. Use read-only SELECT queries.
4. Add explicit `LIMIT` clauses for exploration.
5. Use narrow date ranges and filters before expanding.
6. Stop and ask before broad scans, high-cardinality group-bys, or potentially expensive queries.
7. Never echo credentials, OAuth tokens, API keys, or connection strings.
8. Treat returned organization, service, billing, schema, and row data as account data: summarize minimally, avoid dumping raw results unless requested, and ask before export-like outputs.

## Schema Design Checks

- Plan `ORDER BY` before table creation; changing it later usually means a table rebuild.
- Put lower-cardinality and frequently filtered columns earlier in `ORDER BY`.
- Prefer native types over storing everything as `String`.
- Use the smallest numeric type that safely fits the data.
- Use `LowCardinality(String)` for repeated strings with bounded cardinality.
- Avoid `Nullable` where a default value cleanly represents missing data.
- Keep partition cardinality bounded; partition for lifecycle management more than routine query speed.
- Consider starting without partitioning unless retention or data-management needs justify it.

## Query Review Checks

- Filter on the `ORDER BY` prefix whenever possible.
- Filter tables before joins instead of joining large unfiltered inputs.
- Use `ANY JOIN` when only one match is needed.
- Consider dictionaries, denormalization, projections, or materialized views before adding frequent large joins.
- Use skipping indexes for selective filters that are not covered by `ORDER BY`, but validate with real query patterns.
- Use `EXPLAIN` or a small bounded query to confirm assumptions before recommending major changes.

## Ingestion Checks

- Batch inserts around 10,000 to 100,000 rows when possible.
- Use async inserts for high-frequency small inserts.
- Prefer native or efficient columnar formats for bulk loading.
- Avoid frequent `ALTER TABLE UPDATE`; model update patterns with engines such as `ReplacingMergeTree` when appropriate.
- Avoid frequent large deletes; prefer partition drops, retention policies, or lightweight deletes when appropriate.
- Avoid routine `OPTIMIZE TABLE ... FINAL`; let background merges work unless there is a specific operational reason.

## Materialized Views

- Use incremental materialized views for real-time aggregations.
- Use refreshable materialized views when the query depends on complex joins or full recomputation.
- Make sure the target table key matches the query pattern.
- Document freshness expectations and backfill behavior.

## Response Shape

For reviews, answer with:

```md
Rules checked:
- [area] - [pass/fail/needs evidence]

Findings:
- [specific issue, why it matters in ClickHouse, concrete fix]

Open questions:
- [missing schema/query/workload detail that would change the answer]
```

If evidence is missing, say what to inspect next instead of guessing.
