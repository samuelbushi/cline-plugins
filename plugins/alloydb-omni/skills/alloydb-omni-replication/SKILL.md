---
name: alloydb-omni-replication
description: Use this skill for AlloyDB Omni replication slots, publication tables, lag, replica state, and distributed setup review.
---

# AlloyDB Omni Replication

Use this skill when investigating logical or physical replication behavior.

## Read-Only Checks

- Database overview and replica status.
- Replication slots and retained WAL size.
- Publication tables and publication scope.
- Replica process state, sync state, and lag.

## Workflow

1. Clarify whether the user is debugging lag, validating replication, or preparing a topology change.
2. Confirm the source database, target system, and replication type.
3. Gather read-only status before recommending changes.
4. Explain whether lag is measured in bytes, time, replay position, or sync state.
5. Recommend changes with risk, data-loss implications, and rollback.

## Guardrails

- Do not drop slots, alter publications, restart databases, or promote replicas without confirmation.
- Treat retained WAL growth as a storage risk.
- Treat failover and topology changes as availability-sensitive.
