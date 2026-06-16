# dataproc

Dataproc workflow guidance for Cline.

## Cline Primitives

This package plugin installs the `dataproc` skill. The skill helps Cline inspect Google Cloud Dataproc clusters and jobs, troubleshoot Spark and Hadoop workloads, and plan safe cluster or job lifecycle changes.

The plugin also bundles a small read-oriented helper script for Dataproc Toolbox calls: `list_clusters`, `get_cluster`, `list_jobs`, and `get_job`. The script is only run when the user asks Cline to inspect Dataproc state.

## Requirements

- A Google Cloud project with the Dataproc API enabled.
- Application Default Credentials available to the Cline process.
- `DATAPROC_PROJECT` and `DATAPROC_REGION` set in the environment.
- Dataproc Viewer permissions for read-only inspection.
- Network access for `npx @toolbox-sdk/server@1.1.0` when using the bundled helper script.

The plugin does not register an MCP server, store credentials, or run Google Cloud commands during installation. Stronger permissions such as Dataproc Editor are only needed if the user explicitly asks Cline to execute lifecycle changes. Those commands should be previewed and explicitly approved before Cline runs them.

## Attribution

This plugin includes Dataproc helper script behavior derived from `gemini-cli-extensions/dataproc`, licensed under Apache-2.0. See `LICENSE.dataproc`.
