---
name: airflow-lineage
description: Use when modeling Airflow assets, datasets, inlets, outlets, OpenLineage extractors, or source and downstream impact analysis.
---

# Airflow Lineage

Use this skill when the user asks where data comes from, what depends on a table, how to add lineage to Airflow tasks, or how to build OpenLineage coverage.

## Investigation

- Identify the table, dataset, asset, DAG, task, or external system being analyzed.
- Search DAG code for assets, datasets, inlets, outlets, SQL strings, dbt invocations, and operator-specific inputs.
- Use Airflow MCP reads where available to inspect assets, DAG runs, and task metadata.
- Cross-check warehouse references before making impact claims.

## Adding Manual Lineage

- Add inlets and outlets where operators do not emit lineage automatically.
- Use stable identifiers for datasets and assets.
- Keep lineage metadata close to the task that reads or writes the data.
- Avoid overstating lineage when the task contains dynamic SQL or runtime-generated paths.

## OpenLineage Extractors

Use custom extractors when built-in operator extraction is missing or incomplete.

Plan:

1. Identify operator class and runtime attributes.
2. Extract inputs, outputs, job namespace, job name, and run facets.
3. Add tests for representative operator instances.
4. Verify behavior with local DAG parsing or a targeted run.

## Impact Analysis

- For downstream impact, list affected DAGs, tasks, tables, assets, dashboards, and SLAs where evidence exists.
- For source tracing, identify source systems, staging layers, transforms, and schedules.
- State uncertainty when lineage is inferred from names or SQL text rather than explicit metadata.
