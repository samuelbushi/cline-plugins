---
name: posthog-data-warehouse
description: This skill should be used when the user asks about PostHog data warehouse sources, batch exports, sync health, failed imports, incremental sync configuration, endpoints, materialized data, or joining PostHog data with external datasets.
---

# PostHog Data Warehouse

Use this skill for warehouse-backed analytics and data sync issues.

## Source Health

Clarify the source type, destination, sync schedule, last successful run, failing table, error message, and expected freshness. Use MCP to inspect source status when available.

For failed syncs, check credentials, permissions, table or schema changes, rate limits, partition settings, incremental cursor configuration, and recent upstream changes.

## Queries And Joins

Validate table names and column types before writing SQL. Bound queries by time and row count. Prefer aggregate checks before raw extracts.

## Batch Exports

Before downloading files or exporting data, confirm destination, retention, data sensitivity, and whether personal data is included.

## Output

State current freshness, failure cause or hypothesis, affected data, and the smallest safe remediation.
