---
name: alloydb-postgres-monitor
description: Use this skill for AlloyDB query monitoring, active sessions, locks, query plans, system metrics, and query performance investigation.
---

# AlloyDB Postgres Monitor

Use this skill for observing AlloyDB behavior before changing anything.

## Investigation Flow

1. Clarify the symptom: latency, CPU, memory, lock waits, replication lag, connection pressure, storage growth, or a specific query.
2. Establish the scope: project, cluster, instance, database, time window, and whether production traffic is involved.
3. Start read-only: active queries, locks, database stats, system metrics, and query stats.
4. For SQL tuning, inspect the query text and use `EXPLAIN` without `ANALYZE` first.
5. Summarize likely causes and list the evidence behind each conclusion.

## Cloud Monitoring

Use Cloud Monitoring metrics only after confirming project, instance, cluster, and time window. For PromQL-style queries, keep the first query narrow and use a short default window such as 5 minutes unless the user asks for a different range.

Useful metric families include CPU utilization, memory, storage, connections, transaction counts, tuple reads and writes, deadlocks, wait events, replication lag, and Query Insights metrics.

## Guardrails

- Do not cancel queries, kill sessions, restart instances, or change settings without explicit confirmation.
- Avoid fetching full query text for sensitive workloads unless it is necessary and the user agrees.
- Prefer query hashes, metrics, and summarized SQL when that answers the question.
