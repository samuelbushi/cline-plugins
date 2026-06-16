---
name: alloydb-omni-kubernetes
description: Use this skill for AlloyDB Omni Operator workflows in Kubernetes, including DBClusters, DBInstances, backups, restores, failovers, switchovers, and PgBouncer resources.
---

# AlloyDB Omni Kubernetes

Use this skill when AlloyDB Omni is deployed through the Kubernetes operator.

## Requirements

- Confirm the active Kubernetes context and namespace before running commands.
- Use `kubectl` only when the user approves the target cluster.
- Start with read-only `kubectl get` and `kubectl describe`.

## Resource Model

Important external resources include DBClusters, DBInstances, BackupPlans, Backups, Restores, Failovers, Switchovers, Replications, PgBouncers, Sidecars, and authentication resources.

Internal instance resources and pods are useful for diagnosis, but do not edit internal resources directly unless the user specifically asks and understands the risk.

## Workflow

1. Identify the namespace and DBCluster.
2. Read resource status with `kubectl get`.
3. Use `kubectl describe` to inspect events when status is unclear.
4. For connection, prefer a user-run or explicitly approved `kubectl port-forward` because it is persistent.
5. For changes, draft manifests or commands first and ask for confirmation.

## Guardrails

- Do not apply, delete, fail over, switch over, restore, or alter Kubernetes resources without explicit confirmation.
- Treat failover, switchover, restore, and backup operations as availability-sensitive.
- Do not leave port-forward or watch commands running without making that behavior clear.
