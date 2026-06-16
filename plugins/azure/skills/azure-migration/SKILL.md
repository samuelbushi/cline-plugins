---
name: azure-migration
description: Use this skill for moving workloads to Azure, modernizing existing applications, assessing AWS/GCP/on-prem dependencies, and planning phased migration paths.
---

# Azure Migration

Use this skill for migration and modernization work that targets Azure.

## Workflow

1. Inventory the current application, runtime, dependencies, data stores, network paths, IAM model, deployment process, and operational constraints.
2. Classify the migration: rehost, replatform, refactor, replace, retire, or retain.
3. Map source services to Azure equivalents and call out gaps, behavior differences, and lock-in risks.
4. Create a phased plan with discovery, proof of concept, data migration, parity validation, cutover, rollback, and decommissioning.
5. Keep generated code and infrastructure reviewable, with explicit assumptions for subscriptions, regions, networking, and identity.

## Guardrails

- Ask before scanning cloud accounts, querying live inventories, reading production configuration, exporting data, or modifying infrastructure.
- Do not start cutover, DNS, database replication, or destructive cleanup without explicit approval.
- Do not copy secrets from source environments into Azure config. Use managed identity, Key Vault, or migration-time secret rotation.
- Prefer incremental validation and rollback plans over big-bang migration steps.
