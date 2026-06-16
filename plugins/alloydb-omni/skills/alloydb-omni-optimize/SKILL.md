---
name: alloydb-omni-optimize
description: Use this skill for AlloyDB Omni settings, memory configuration, extensions, autovacuum tuning, and columnar engine optimization.
---

# AlloyDB Omni Optimize

Use this skill when tuning database behavior beyond a single query.

## Tuning Areas

- PostgreSQL settings and memory configuration.
- Installed and available extensions.
- Autovacuum configuration.
- Columnar engine configuration and recommended columns.
- Workload-specific settings for analytical or transactional patterns.

## Workflow

1. Identify the workload and target outcome.
2. Gather current settings and evidence before recommending changes.
3. Explain whether the change is session-level, database-level, instance-level, container-level, or Kubernetes-level.
4. Propose the smallest change that addresses the evidence.
5. Include validation steps and rollback.

## Guardrails

- Do not alter settings, install extensions, or change columnar configuration without confirmation.
- Do not recommend columnar changes for transactional paths without evidence.
- Avoid tuning from defaults alone; use workload evidence when possible.
