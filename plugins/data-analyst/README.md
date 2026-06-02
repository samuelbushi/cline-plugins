# data-analyst

Bundle the ClickHouse data analyst skill as an installable Cline plugin.

## What It Does

Installs the `data-analyst` skill and its supporting sub-skills. The skill provides an elicitation-first workflow for answering analytics questions against ClickHouse, including connection setup, data dictionary lookup, safe SQL, analysis, plotting, and artifact management.

The package also bundles the ClickHouse skills that `data-analyst` references for best practices, local file analysis with chDB, local ClickHouse development, Cloud deployment, architecture guidance, and JavaScript client work.

## Install

```bash
cline plugin install data-analyst
```

For local development from this repository:

```bash
cline plugin install ./plugins/data-analyst --cwd .
```

## Requirements

- `clickhousectl` for ClickHouse server and Cloud workflows.
- Python dependencies as required by the bundled chDB skills when analyzing local files.
- ClickHouse credentials or browser OAuth depending on the target connection.

## Security Notes

The bundled skill instructs agents to use `clickhousectl` instead of ClickHouse MCP tools, ask before expensive or unbounded queries, and avoid echoing credentials or secrets.

## Attribution

Several bundled ClickHouse sub-skills are derived from `ClickHouse/agent-skills`, licensed under Apache-2.0. See `LICENSE.clickhouse-agent-skills` and `NOTICE.clickhouse-agent-skills`.

