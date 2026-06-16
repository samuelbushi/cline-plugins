---
name: airflow-debugging
description: Use when diagnosing failed Airflow DAGs, failed task instances, parse errors, import errors, scheduling issues, retries, stuck runs, or missing logs.
---

# Airflow Debugging

Use this skill for DAG failures, broken DAGs, task failures, stuck schedules, parse errors, missing dependencies, and root-cause analysis.

## Triage Order

1. Identify the target instance, DAG ID, run ID, and task ID.
2. Check Airflow health, scheduler status, import errors, and DAG warnings.
3. Inspect DAG metadata, schedule, pause state, recent runs, and failed task instances.
4. Read the relevant task logs.
5. Inspect the DAG source and related project files.
6. Propose the smallest fix and a validation loop.

## Common Causes

- Import-time side effects or missing Python packages.
- Renamed connections, variables, pools, or provider packages.
- Schedule, catchup, timezone, or dataset dependency surprises.
- Worker image drift between local and deployed environments.
- Credentials or network access missing in the task runtime.
- Non-idempotent tasks that fail on retry.
- Deferrable operator or triggerer issues.

## Safety

- Do not clear, retry, delete, pause, unpause, or trigger runs without explicit confirmation.
- Before any state-changing action, summarize the target instance, DAG ID, run ID, task ID, and command or MCP operation.
- Prefer reading logs and metadata before changing state.

## Fix Loop

- Make one focused code/config change at a time.
- Re-run parse checks after import fixes.
- Use a targeted DAG or task test when available.
- If a production run must be retried or cleared, ask for confirmation and explain the downstream effect.
