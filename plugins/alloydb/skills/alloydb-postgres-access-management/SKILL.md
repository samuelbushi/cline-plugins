---
name: alloydb-postgres-access-management
description: Use this skill for AlloyDB database users, roles, grants, permissions, and security-related PostgreSQL settings.
---

# AlloyDB Postgres Access Management

Use this skill for access control and user management.

## Requirements

- Confirm the cluster, database, role, and user before changes.
- Prefer IAM users when appropriate.
- Use built-in database users only when the user explicitly needs password-based access.
- For Google Cloud user operations, AlloyDB Admin is usually required.

## Workflow

1. Start by listing users, roles, and relevant settings.
2. Identify whether the task is Google Cloud IAM, AlloyDB user management, PostgreSQL roles, or database grants.
3. For new users, ask what access pattern is needed: read-only, read-write, app user, migration user, admin, or break-glass.
4. Draft the grants or user creation command before running it.
5. Verify access with read-only checks after changes.

## Guardrails

- Do not ask the user to paste passwords into chat.
- Do not grant broad roles such as superuser-like privileges unless the user explicitly requests them and accepts the risk.
- Do not revoke or alter roles in production without a rollback plan.
- Redact user names or role details if the user indicates they are sensitive.
