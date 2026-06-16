---
name: alloydb-postgres-data
description: Use this skill for AlloyDB schema discovery, table inspection, views, indexes, triggers, and safe SQL execution.
---

# AlloyDB Postgres Data

Use this skill when working with data and schema inside an AlloyDB PostgreSQL database.

## Requirements

- Confirm the database, schema, and target table before querying or changing data.
- Use `psql` or an approved database client already available in the user's environment.
- Confirm the database in the connection context, and use `schema.table` for SQL identifiers when a schema qualifier is needed.

## Read Workflow

1. Inspect schemas and tables before writing custom SQL.
2. Use bounded queries with `LIMIT` for previews.
3. For schema exploration, gather table names, columns, constraints, indexes, views, triggers, and stored procedures as needed.
4. Summarize results instead of dumping large tables.
5. Redact obvious secrets and personal data unless the user explicitly needs those values.

## Write Workflow

1. Draft the SQL first.
2. Explain the rows or objects expected to change.
3. Ask for explicit confirmation before `INSERT`, `UPDATE`, `DELETE`, DDL, grants, or migrations.
4. Prefer transactions for multi-step changes.
5. When possible, run a `SELECT` preview first and include a rollback plan.

## Guardrails

- Do not run destructive SQL without confirmation.
- Do not use `ANALYZE`, `VACUUM`, locks, or maintenance commands on production-looking databases without confirming timing and impact.
- Do not print credentials or connection strings that include passwords.
