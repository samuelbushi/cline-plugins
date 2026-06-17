# Domino

Domino adds Cline support for building, operating, and deploying Domino Data Lab projects. It covers project files and jobs through MCP, plus workflow guidance for apps, environments, datasets, MLflow, Flows, model endpoints, GenAI tracing, governance, taxonomy, workspaces, and Domino SDK usage.

## Cline Primitives

This plugin registers the local `domino` MCP server. The server runs through `uv` and exposes tools to detect Domino workspace context, run jobs, inspect job status and output, and transfer explicit file content for DFS-based Domino projects.

It bundles 23 Domino skills with their supporting references and templates. The skills cover:

- Domino project, job, launcher, workspace, and environment workflows.
- Data connectivity, datasets, Domino Data SDK, NetApp Volumes, and distributed computing.
- MLflow experiment tracking, GenAI tracing, model endpoints, model monitoring, governance, and taxonomy workflows.
- Domino-ready web app bootstrap, app deployment, UI design, AI Gateway, and modeling assistant setup.

A Domino safety rule reminds Cline to ask before remote job runs, DFS uploads, forced overwrites, app or model deployments, governance/taxonomy writes, cloud changes, and secret setup.

## Requirements

- `uv` on PATH.
- Python 3.11 or newer.
- Access to a Domino Data Lab instance.
- Inside a Domino workspace, Domino-provided environment variables and the local token endpoint are used automatically.
- Outside Domino, start Cline with `DOMINO_HOST` and `DOMINO_API_KEY` set in the environment.

The MCP can launch remote jobs and write project files. Treat job runs, uploads, and forced overwrites as user-confirmed operations. Read local files through normal Cline file tools before passing explicit content to the Domino MCP. For Git-backed Domino projects, use normal Git workflows instead of DFS file sync tools.
