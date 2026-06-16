---
name: appwrite-tablesdb
description: Use when designing or modifying Appwrite TablesDB databases, tables, rows, queries, permissions, indexes, and migrations.
---

# Appwrite TablesDB

Use this skill for Appwrite database, table, row, query, schema, permission, and migration tasks.

## API Choice

- Prefer TablesDB for new work.
- Use legacy Databases APIs only when the existing codebase already uses them or the user explicitly asks for legacy compatibility.
- Do not mix TablesDB and legacy Databases patterns in the same feature unless migration requires it.

## Schema Design

- Identify database ID, table ID, row ID strategy, column names, column types, required flags, defaults, and relationships before writing code.
- Use explicit string column types for new columns.
- Prefer short indexed strings for identifiers, slugs, names, and enum-like values.
- Use longer text column types for large unindexed content.
- Avoid storing secrets, access tokens, or raw credentials in user-visible rows.

## Queries

- Keep query filters narrow and deterministic.
- Add limits and pagination for list operations.
- Prefer indexed fields for frequently filtered or sorted queries.
- Preserve existing repository query helper style before introducing new abstractions.

## Permissions

- Be explicit about read, create, update, and delete permissions.
- Do not make rows, tables, or buckets public by default.
- Confirm whether access should be user-owned, team-owned, role-based, or admin-only.
- For server-side admin code, keep API key usage on the server.

## Migration Safety

- Inspect existing schema and data access code before changing column names or types.
- Plan backwards-compatible changes when production data may exist.
- Avoid destructive table, column, index, or row changes without user confirmation.
- When a migration script is needed, make it idempotent where practical and log what it changes without logging secrets.
