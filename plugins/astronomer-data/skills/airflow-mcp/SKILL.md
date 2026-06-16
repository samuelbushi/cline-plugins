---
name: airflow-mcp
description: Use when working with the Airflow MCP server or af CLI. Covers connection setup, read-only mode, safe tool selection, Airflow health, DAG/run/task inspection, and mutation boundaries.
---

# Airflow MCP

Use this skill when a task needs live Airflow state through the `airflow` MCP server or the `af` CLI.

## Connection Model

The plugin registers `uvx astro-airflow-mcp==0.8.2 --transport stdio`.

Default target:

```bash
http://localhost:8080
```

Supported environment values:

```bash
AIRFLOW_API_URL
AIRFLOW_USERNAME
AIRFLOW_PASSWORD
AIRFLOW_AUTH_TOKEN
AIRFLOW_VERIFY_SSL
AIRFLOW_CA_CERT
AF_READ_ONLY
```

Use either `AIRFLOW_AUTH_TOKEN` or username/password. Prefer `AF_READ_ONLY=true` for investigation-only work.

## First Checks

- Confirm the intended Airflow instance before querying or mutating anything.
- Prefer read-only inspection before changing Airflow state.
- Treat task logs, variables, connection metadata, and config output as potentially sensitive.
- Do not print credentials or tokens.

## Common Safe Reads

- List DAGs and inspect metadata.
- Explore a DAG structure and recent runs.
- Read import errors and DAG warnings.
- Inspect task instances and task logs for a specified run.
- Check Airflow version, providers, plugins, pools, assets, and health.

## Mutating Operations

Ask for explicit confirmation before:

- Triggering a DAG run.
- Clearing a DAG run or task instances.
- Deleting a DAG run.
- Pausing or unpausing a DAG.
- Creating tokens or changing instance config.
- Calling arbitrary write endpoints through a direct API helper.

Before asking for confirmation, summarize the instance URL, DAG ID, run ID, task ID, and exact operation.
