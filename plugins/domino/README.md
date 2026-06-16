# Domino

Domino adds Cline support for Domino Data Lab work across jobs, DFS project files, environments, experiment tracking, Flows, data connectivity, and NetApp Volumes.

## Cline Primitives

This plugin registers the `domino` MCP server. The server runs locally through `uv` and exposes tools to:

- Detect whether Cline is running inside a Domino workspace.
- Run Domino jobs and check job status or stdout.
- List, download, upload explicit content, and conflict-check files in DFS-based Domino projects.

It also bundles Cline skills for setup, safe MCP usage, compute environments, MLflow experiment tracking, Domino Flows, external data connectivity, and NetApp Volumes.

## Requirements

- `uv` on PATH.
- Python 3.11 or newer.
- Access to a Domino Data Lab instance.
- Inside a Domino workspace, Domino-provided environment variables and the local token endpoint are used automatically.
- Outside Domino, start Cline with `DOMINO_HOST` and `DOMINO_API_KEY` set in the environment.

The MCP can launch remote jobs and write project files. Treat job runs, uploads, and forced overwrites as user-confirmed operations. Read local files through normal Cline file tools before passing explicit content to the Domino MCP. Do not use the file sync tools for Git-backed projects; use normal Git workflows there.
