---
name: alloydb-omni-monitor
description: Use this skill for AlloyDB Omni active query, lock, long-running transaction, database stats, and server-state troubleshooting.
---

# AlloyDB Omni Monitor

Use this skill for read-only troubleshooting of a running AlloyDB Omni database.

## Investigation Flow

1. Clarify the symptom: slow query, lock wait, connection pressure, transaction age, memory pressure, storage growth, or startup issue.
2. Confirm connection details and whether the database is production-like.
3. Start with read-only checks: database overview, active queries, locks, long-running transactions, settings, and database stats.
4. Summarize likely causes with evidence.
5. Propose next actions separately from the evidence.

## Guardrails

- Do not cancel queries, terminate sessions, restart containers, restart pods, or change settings without confirmation.
- Avoid fetching full query text for sensitive workloads unless necessary.
- Prefer bounded result sets and summaries.
