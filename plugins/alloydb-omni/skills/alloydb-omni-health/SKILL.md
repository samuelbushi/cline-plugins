---
name: alloydb-omni-health
description: Use this skill for AlloyDB Omni database health checks, including table stats, invalid indexes, bloat signals, autovacuum, and tablespaces.
---

# AlloyDB Omni Health

Use this skill to assess maintenance and storage health.

## Health Checklist

- Connection counts and active connections.
- Table statistics, sequential scans, dead rows, and stale stats.
- Invalid or unused indexes.
- Estimated bloat from dead tuples.
- Autovacuum settings and recent vacuum or analyze activity.
- Tablespace usage and storage pressure.

## Workflow

1. Ask whether the database is production-like and whether the user wants a read-only assessment.
2. Gather read-only statistics first.
3. Separate evidence from recommendations.
4. Prioritize fixes by risk, urgency, and expected impact.
5. Explain maintenance windows, locks, IO, and rollback where relevant.

## Guardrails

- Do not run `VACUUM FULL`, `REINDEX`, `ANALYZE`, table rewrites, or cleanup commands without confirmation.
- Treat bloat estimates as directional unless current statistics are confirmed.
- Prefer lower-impact maintenance first.
