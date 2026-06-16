---
name: airflow-dag-authoring
description: Use when creating or changing Apache Airflow DAGs. Covers repository discovery, operator selection, schedule design, dependency structure, validation, and test planning.
---

# Airflow DAG Authoring

Use this skill when the user wants to create a DAG, modify pipeline code, add tasks, change schedules, or choose Airflow operators.

## Discover

- Find existing DAGs and follow local naming, imports, tags, default args, owners, retry policy, and folder structure.
- Check dependency files such as `requirements.txt`, `pyproject.toml`, `Dockerfile`, and provider packages.
- Identify Airflow version before using newer APIs.
- Look for project-specific helpers, task groups, decorators, and connection naming conventions.

## Plan

Before editing, state:

- DAG purpose and schedule.
- Tasks and dependency graph.
- Operators, sensors, deferrable operators, datasets, or task groups.
- Required Airflow connections, variables, pools, and packages.
- Validation plan.

## Implement

- Prefer simple, explicit DAG code over clever dynamic generation.
- Keep side-effecting code inside tasks, not at module import time.
- Avoid network calls, database queries, or secret reads during DAG parse.
- Use stable `dag_id`, task IDs, tags, and start dates.
- Make retries, timeouts, pools, and concurrency intentional.
- Keep secrets in Airflow connections, variables, or the deployment environment, not in DAG files.

## Validate

- Run local parse checks when available, such as `astro dev parse`.
- Use Airflow or MCP read tools to check import errors and DAG warnings.
- Inspect the DAG structure before triggering a run.
- Ask for confirmation before triggering or backfilling runs.

## When To Use Other Skills

- Use `airflow-debugging` for failed runs, task logs, import errors, and root-cause analysis.
- Use `airflow-deployments` for `astro deploy`, CI/CD, image builds, or production rollout.
- Use `airflow-lineage` for assets, datasets, inlets, outlets, or OpenLineage.
