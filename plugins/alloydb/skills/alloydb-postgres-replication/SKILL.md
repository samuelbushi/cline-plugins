---
name: alloydb-postgres-replication
description: Use this skill for AlloyDB read pools, replica status, replication slots, publication tables, lag, and high availability checks.
---

# AlloyDB Postgres Replication

Use this skill when investigating replication and read scaling.

## Read-Only Checks

- List instances and identify primary versus read pool instances.
- Check replication lag and replica connection state.
- Inspect replication slots and outstanding WAL retained by slots.
- Inspect publication tables when logical replication is involved.
- Confirm whether lag is measured in time, bytes, or replay state.

## Workflow

1. Clarify whether the user is debugging lag, planning read scaling, or validating high availability.
2. Confirm project, region, cluster, primary instance, and read pool or replica names.
3. Gather read-only status before recommending changes.
4. Explain whether observed lag affects reads, failover readiness, storage, or downstream consumers.
5. Recommend actions with risk and timing, not just commands.

## Guardrails

- Do not drop replication slots, change publications, restart instances, or resize read pools without explicit confirmation.
- Treat replication changes as availability-sensitive.
- If WAL retention is growing, explain the storage risk before proposing cleanup.
