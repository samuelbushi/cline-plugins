---
name: alloydb-postgres-health
description: Use this skill for AlloyDB database health checks, including table statistics, invalid indexes, bloat, autovacuum, tablespaces, and cardinality review.
---

# AlloyDB Postgres Health

Use this skill to assess database health and maintenance signals.

## Health Checklist

- Connection usage and active connection percentage.
- Table statistics, sequential scans, dead tuples, and stale stats.
- Invalid indexes and unused indexes.
- Estimated table bloat and index bloat.
- Autovacuum settings and whether tables appear to need vacuum or analyze.
- Tablespace and storage pressure.
- Column cardinality when considering indexes or query patterns.

## Workflow

1. Ask whether this is production and whether the user wants a read-only assessment.
2. Gather read-only statistics first.
3. Separate evidence from recommendations.
4. Prioritize recommendations by risk and expected impact.
5. For maintenance actions, explain lock, IO, and availability implications.

## Guardrails

- Do not run `VACUUM FULL`, `REINDEX`, `ANALYZE`, or other maintenance actions without explicit approval.
- Recommend lower-impact options first, such as targeted `ANALYZE`, concurrent index creation, or scheduled maintenance windows.
- Treat bloat and cardinality estimates as directional unless fresh statistics are confirmed.
