---
name: alloydb-omni-performance
description: Use this skill for AlloyDB Omni query performance analysis, execution plans, query statistics, table statistics, and column cardinality review.
---

# AlloyDB Omni Performance

Use this skill when tuning SQL or diagnosing query performance.

## Workflow

1. Capture the query, workload goal, data size, and whether the environment is production-like.
2. Use `EXPLAIN` first. Use `EXPLAIN ANALYZE` only when the user accepts that the query will execute.
3. Inspect table stats, query stats, index usage, row estimates, and column cardinality.
4. Check whether `pg_stat_statements` or other required extensions are installed before relying on query stats.
5. Propose concrete changes with expected impact and rollback.

## Recommendations

- Tie index recommendations to predicates, joins, ordering, and observed row estimates.
- Consider columnar engine recommendations for analytical workloads.
- Separate quick query rewrites from schema or settings changes.

## Guardrails

- Do not run unbounded or write queries while investigating performance.
- Do not run `ANALYZE` or heavy diagnostics without user approval.
- Do not assume one slow query proves a global tuning issue.
