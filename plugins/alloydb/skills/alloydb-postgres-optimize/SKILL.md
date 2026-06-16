---
name: alloydb-postgres-optimize
description: Use this skill for AlloyDB performance tuning, PostgreSQL settings, memory configuration, extensions, and query optimization planning.
---

# AlloyDB Postgres Optimize

Use this skill when tuning AlloyDB or PostgreSQL behavior.

## Tuning Flow

1. Identify the workload and goal: lower latency, higher throughput, lower cost, fewer locks, better cache behavior, or query plan stability.
2. Gather baseline evidence before recommending changes.
3. Inspect relevant settings, installed extensions, available extensions, memory configuration, and query plans.
4. Propose the smallest change that addresses the evidence.
5. Include how to measure success and how to roll back.

## Query Optimization

- Use `EXPLAIN` first. Use `EXPLAIN ANALYZE` only when the user accepts that the query will execute.
- Check indexes, join order, predicates, row estimates, and whether statistics look stale.
- Prefer specific indexes tied to observed predicates and ordering.
- Consider partial indexes, covering indexes, and expression indexes only when the workload justifies them.

## Guardrails

- Do not change cluster or database settings without explicit confirmation.
- Do not install extensions without confirming compatibility, permissions, and maintenance expectations.
- Do not optimize from a single anecdote when metrics or plans are available.
