---
name: alloydb-omni-access-control
description: Use this skill for AlloyDB Omni roles, permissions, grants, and security-related PostgreSQL settings.
---

# AlloyDB Omni Access Control

Use this skill for users, roles, grants, and security settings inside AlloyDB Omni.

## Workflow

1. Confirm the database, role, user, and target schema or object.
2. Inspect roles and grants before changes.
3. Identify whether the task is login access, object grants, role membership, password rotation, or settings review.
4. Draft the SQL or operational command before running it.
5. Verify access with read-only checks after changes.

## Guardrails

- Do not ask the user to paste passwords into chat.
- Do not grant superuser-like privileges unless the user explicitly requests them and accepts the risk.
- Do not revoke or alter roles in production-like environments without a rollback plan.
- Redact role or user details if the user indicates they are sensitive.
