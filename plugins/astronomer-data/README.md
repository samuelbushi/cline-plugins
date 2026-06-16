# astronomer-data

Airflow MCP and skills for Cline users building, operating, and troubleshooting Airflow data pipelines.

## What It Adds

- `airflow` MCP server through `uvx astro-airflow-mcp==0.8.2 --transport stdio`.
- `airflow-mcp` skill for choosing MCP tools safely and configuring Airflow connection settings.
- `airflow-dag-authoring` skill for writing and validating DAGs.
- `airflow-debugging` skill for failed DAG runs, task logs, import errors, and root-cause analysis.
- `airflow-deployments` skill for Astro and open-source Airflow deployment workflows.
- `airflow-lineage` skill for Airflow assets, datasets, inlets, outlets, and OpenLineage planning.
- `airflow-data-quality` skill for freshness checks, profiling, and warehouse-backed data quality investigations.

## Install

```bash
cline plugin install astronomer-data
```

For local development from this repository:

```bash
cline plugin install ./plugins/astronomer-data --cwd .
```

The MCP server runs from PyPI through `uvx` with `astro-airflow-mcp==0.8.2`. By default it targets local Airflow at `http://localhost:8080`. To persist connection values into the plugin-owned MCP entry, set any of these variables before installing or reinstalling:

```bash
AIRFLOW_API_URL=https://airflow.example.com
AIRFLOW_USERNAME=admin
AIRFLOW_PASSWORD=<password>
AIRFLOW_AUTH_TOKEN=<token>
AIRFLOW_VERIFY_SSL=false
AIRFLOW_CA_CERT=/path/to/ca.pem
AF_READ_ONLY=true
```

Use either `AIRFLOW_AUTH_TOKEN` or username/password. Set `AF_READ_ONLY=true` when Cline should inspect Airflow without triggering, clearing, pausing, unpausing, deleting, or mutating workflow state.

Changing these values later requires reinstalling the plugin with the new environment or updating the plugin-owned MCP entry in Cline's MCP settings.

## Requirements

- Cline with plugin MCP registration support.
- `uvx` available on `PATH`.
- Network access to the target Airflow webserver when using remote Airflow.
- Airflow API credentials, or a local Airflow instance using the default URL.
- Astro CLI only for Astro project setup, local environment, and deployment workflows.

## Security Notes

The Airflow MCP can expose DAGs, task logs, variables, connections metadata, assets, and operational controls. Treat task logs and variables as potentially sensitive.

Destructive or production-impacting actions require explicit user confirmation. This includes triggering DAGs, clearing task instances, deleting DAG runs, pausing or unpausing DAGs, creating tokens, changing deployments, and running `astro deploy`.
