---
name: alloydb-postgres-admin
description: Use this skill for AlloyDB cluster and instance administration, including planning, listing, creating, and tracking long-running operations.
---

# AlloyDB Postgres Admin

Use this skill for AlloyDB control-plane work in Google Cloud.

## Requirements

- Confirm the Google Cloud project, region, cluster, and instance before running commands.
- Use `gcloud alloydb` when available.
- Use Application Default Credentials or the user's existing Google Cloud auth.
- For get/list work, AlloyDB Viewer is usually enough.
- For create, update, delete, or user-management work, AlloyDB Admin is usually required.

## Workflow

1. Start with read-only discovery: list clusters, list instances, or get a specific cluster or instance.
2. Restate the target resource and region before changes.
3. For creation, ask for all required values before drafting a command.
4. Show the exact command or plan before running any write operation.
5. Treat cluster and instance creation as long-running operations. Capture the operation ID and explain how to check status.
6. After creating a new resource, do not assume the current database connection points at it. Ask the user to update their environment or connection settings first.

## Guardrails

- Do not create, delete, resize, or reconfigure AlloyDB resources without explicit user confirmation.
- Do not ask users to paste passwords into chat. Prefer IAM authentication or environment-specific credential handling.
- If a permission error occurs, name the missing operation and suggest the narrowest likely IAM role.
