---
name: spanner-data
description: Use when the user needs to explore Google Cloud Spanner schema, list tables or graphs, run read-only SQL, or execute explicitly approved DML against Spanner.
---

# Spanner Data

Use these skills when you need to explore Google Cloud Spanner database structure, discover schema objects like tables and graphs, and execute custom SQL queries against Spanner data.

## Cline Requirements

The helper scripts require:

- Node.js and `npx`
- Google Cloud Application Default Credentials available to the shell where Cline runs commands
- `SPANNER_PROJECT`, `SPANNER_INSTANCE`, and `SPANNER_DATABASE`
- optional `SPANNER_DIALECT`, set to `googlesql` or `postgresql`

The scripts also load `.env` and `.env.local` from the current workspace when present, without overriding already-set environment variables. Only `SPANNER_PROJECT`, `SPANNER_INSTANCE`, `SPANNER_DATABASE`, `SPANNER_DIALECT`, and `GOOGLE_APPLICATION_CREDENTIALS` are imported from those files before the scripts spawn `npx`. If a script fails because configuration is missing, tell the user which setting is missing without printing any existing secret or credential values.

Prefer read-only workflows by default. Ask for explicit confirmation before running `execute_sql`, schema changes, or any DML that can mutate Spanner data. Confirm the target project, instance, database, and SQL statement before running a mutation. The `execute_sql` script refuses to run unless `SPANNER_ALLOW_MUTATION=1` is set for that command.

## Usage

All scripts can be executed using Node.js. Replace `<param_name>` and `<param_value>` with actual values.

Bash:
`node <skill_dir>/scripts/<script_name>.js '{"<param_name>": "<param_value>"}'`

PowerShell:
`node <skill_dir>/scripts/<script_name>.js '{\"<param_name>\": \"<param_value>\"}'`

The first live script run may download `@toolbox-sdk/server@1.1.0` through `npx`. Treat that as third-party code execution and run it only when the user has approved live Spanner access for the task.

## Scripts


### execute_sql

Use this tool to execute DML SQL with the configured Spanner SQL dialect.

Ask for explicit user confirmation before running this script. It can mutate data.

#### Parameters

| Name | Type | Description | Required | Default |
| :--- | :--- | :--- | :--- | :--- |
| sql | string | The sql to execute. | Yes |  |


---

### execute_sql_dql

Use this tool to execute DQL SQL with the configured Spanner SQL dialect.

Use this script for read queries. Still scope queries carefully and avoid broad scans unless the user confirms they are acceptable.

#### Parameters

| Name | Type | Description | Required | Default |
| :--- | :--- | :--- | :--- | :--- |
| sql | string | The sql to execute. | Yes |  |


---

### list_graphs

Lists detailed graph schema information (node tables, edge tables, labels and property declarations) as JSON for user-created graphs. Filters by a comma-separated list of graph names. If names are omitted, lists all graphs. The output can be 'simple' (graph names only) or 'detailed' (full schema).

#### Parameters

| Name | Type | Description | Required | Default |
| :--- | :--- | :--- | :--- | :--- |
| graph_names | string | Optional: A comma-separated list of graph names. If empty, details for all graphs in user-accessible schemas will be listed. | No | `` |
| output_format | string | Optional: Use 'simple' to return graph names only or use 'detailed' to return the full information schema. | No | `detailed` |


---

### list_tables

Lists detailed schema information (object type, columns, constraints, indexes) as JSON for user-created tables (ordinary or partitioned). Filters by a comma-separated list of names. If names are omitted, lists all tables in user schemas. The output can be 'simple' (table names only) or 'detailed' (full schema).

#### Parameters

| Name | Type | Description | Required | Default |
| :--- | :--- | :--- | :--- | :--- |
| table_names | string | Optional: A comma-separated list of table names. If empty, details for all tables in user-accessible schemas will be listed. | No | `` |
| output_format | string | Optional: Use 'simple' to return table names only or use 'detailed' to return the full information schema. | No | `detailed` |


---
