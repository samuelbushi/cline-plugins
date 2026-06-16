---
name: oracledb
description: Use Oracle Database tools to run bounded SQL, inspect schema objects, explain query plans, monitor sessions, review invalid objects, and check tablespace or SQL resource diagnostics. Use when the user asks to connect to, query, troubleshoot, or inspect an Oracle Database.
---

# Oracle Database

Use this skill when the task involves an Oracle Database instance and the user wants database context, query results, schema inspection, query-plan analysis, session monitoring, object health, or storage diagnostics.

## Connection

The tools use the Oracle Database Toolbox prebuilt connector through the plugin's pinned `@toolbox-sdk/server` dependency. They read configuration from environment variables in the Cline process:

- `ORACLE_CONNECTION_STRING`: Oracle connection string such as `host:port/service_name` or a TNS alias.
- `ORACLE_USERNAME`: Oracle database username.
- `ORACLE_PASSWORD`: Oracle database password.
- `ORACLE_WALLET`: optional path to an Oracle Wallet directory.
- `ORACLE_USE_OCI`: optional `true` to use the OCI thick client driver.

Do not ask the user to paste passwords or wallet contents into chat. If a tool reports missing environment variables, tell the user exactly which variables are missing and ask them to set those in their shell or secret manager before restarting Cline.

## Tools

- `oracle_execute_sql`: executes read-only `SELECT` or `WITH` SQL. It mechanically rejects obvious mutation, DDL, PL/SQL, grant, transaction, and maintenance keywords.
- `oracle_execute_mutation_sql`: executes SQL with possible side effects only after explicit user approval and an exact confirmation field. Use for DML, DDL, PL/SQL, grants, maintenance commands, or any statement that can mutate data or metadata.
- `oracle_get_query_plan`: runs EXPLAIN PLAN for a statement without executing it.
- `oracle_list_tables`: lists tables in the connected schema and accepts an optional comma-separated `names` filter.
- `oracle_list_active_sessions`: lists active sessions when privileges allow access to dynamic performance views.
- `oracle_list_invalid_objects`: lists invalid objects that may require recompilation.
- `oracle_list_tablespace_usage`: reports tablespace capacity and usage.
- `oracle_list_top_sql_by_resource`: reports high-resource SQL from the library cache when privileges allow diagnostics.

## Workflow

1. Start with read-only discovery: list tables, inspect a few rows, or explain a query plan.
2. Keep exploratory SQL bounded with `FETCH FIRST`, filters, or aggregate summaries.
3. For performance work, compare the query plan with table sizes, active sessions, and top SQL diagnostics.
4. If a tool returns a permission error, identify the missing view or privilege. Recommend least-privilege grants rather than broad DBA access.
5. Before any write or maintenance action, explain the target database, affected object names, and expected effect, then wait for explicit approval. Use `oracle_execute_mutation_sql` only after that approval.

## Requirements

Basic connectivity requires `CREATE SESSION`. Monitoring and diagnostics may require privileges on `V$` and `DBA_` views. Wallet or OCI thick-client use requires the local Oracle client and wallet files to be available to the Cline process.
