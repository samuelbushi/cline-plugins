---
name: airflow-data-quality
description: Use when checking data freshness, profiling tables, investigating warehouse-backed data quality issues, or connecting Airflow task behavior to downstream data symptoms.
---

# Airflow Data Quality

Use this skill when the user asks whether data is fresh, why a table looks wrong, what changed in a dataset, or how an Airflow pipeline affects warehouse data.

## Scope

This skill guides investigation. It does not provide a warehouse connector by itself. Use existing project tools, warehouse CLIs, SQL clients, dbt artifacts, or MCP tools already available in the session.

## Freshness

- Identify the table, partition, timestamp column, expected cadence, and timezone.
- Compare latest data timestamp to expected SLA.
- Check source DAG schedules, recent runs, failed tasks, and retries.
- Distinguish "pipeline did not run" from "pipeline ran but produced stale data".

## Profiling

For a target table, inspect:

- Row count and partition counts.
- Null rates for key fields.
- Duplicate keys.
- Min and max timestamps.
- Value distributions for status or enum columns.
- Referential integrity assumptions.

Keep queries bounded with limits, filters, and partition predicates.

## Airflow Linkage

- Map table symptoms back to likely DAGs and tasks.
- Read task logs before assuming warehouse behavior.
- Check recent code changes, deployment timing, and schedule changes.
- If the issue may require rerunning or clearing tasks, ask for confirmation before acting.

## Reporting

Summarize:

- Tables or partitions checked.
- Evidence found.
- Most likely root cause.
- Recommended fix.
- Validation query or Airflow check to prove recovery.
