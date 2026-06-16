---
name: alloydb-omni-data
description: Use this skill for AlloyDB Omni schema discovery, table inspection, views, indexes, triggers, stored procedures, and safe SQL execution.
---

# AlloyDB Omni Data

Use this skill when working with data and schema inside an AlloyDB Omni database.

## Requirements

- Confirm host, port, database, schema, and target table before querying or changing data.
- Use `psql` or an approved database client already available in the user's environment.
- Confirm the database in the connection context, and use `schema.table` for SQL identifiers when a schema qualifier is needed.

## Read Workflow

1. Inspect schemas, tables, columns, constraints, indexes, views, triggers, sequences, and stored procedures as needed.
2. Use bounded `SELECT` queries with `LIMIT` for previews.
3. Prefer targeted schema reads over broad database dumps.
4. Summarize results and link or save artifacts when large output is needed.

## Write Workflow

1. Draft SQL first.
2. Explain expected row or schema impact.
3. Ask for confirmation before `INSERT`, `UPDATE`, `DELETE`, DDL, grants, or migrations.
4. Prefer transactions and rollback plans for multi-step changes.

## Guardrails

- Do not run destructive SQL without confirmation.
- Do not print passwords, connection strings with passwords, or sensitive rows.
- Treat local development databases as potentially important unless the user says they are disposable.
