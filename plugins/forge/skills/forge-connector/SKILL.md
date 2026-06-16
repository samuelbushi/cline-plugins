---
name: forge-connector
description: Build Forge graph connector apps that ingest external data into Atlassian Teamwork Graph for Rovo Search and Rovo Chat. Use for connector architecture, manifest setup, object modeling, permissions, ingestion, and sync workflows.
---

# Forge Connector

Use this skill when the user wants a Forge app that connects external data to Atlassian Teamwork Graph.

## Workflow

1. Confirm the external system, data types, sync direction, target Atlassian site, and whether the data should appear in Rovo Search, Rovo Chat, or both.
2. Use Forge MCP for current graph connector, manifest, permissions, and API guidance.
3. Model the external objects before writing code:
   - stable object ids
   - display title and URL
   - body or searchable text
   - ownership and visibility
   - update and delete behavior
4. Decide the ingestion strategy:
   - one-time import
   - scheduled sync
   - webhook-driven sync
   - manual admin-triggered sync
5. Keep credential handling backend-side and document required app secrets or environment variables.
6. Add scopes and external fetch permissions only for the APIs actually used.
7. Include tests or a small dry-run path that validates object mapping before a full sync.

## Design Checks

- Do not ingest secrets, private notes, or unnecessary personal data.
- Confirm source tenant, target Atlassian site, data classes, visibility rules, and deletion behavior before running any real import, sync, delete, or permission propagation.
- Preserve tenant isolation between Atlassian sites and external accounts.
- Avoid broad scheduled polling when incremental sync or webhooks are available.
- Make deletes and permission changes explicit.
- Log ids and counts, not full sensitive payloads.

## Output

For planning requests, return the connector architecture, manifest changes, sync flow, data model, credential needs, and verification plan. For implementation requests, edit the app only after confirming target app directory and sync scope.
