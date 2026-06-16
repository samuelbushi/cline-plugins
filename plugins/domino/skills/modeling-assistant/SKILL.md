---
name: domino-modeling-assistant
description: Enable AI-assisted model development within Domino by writing needed model and training code and using MCP (Model Context Protocol) servers to execute Domino jobs. Use when setting up Cline to work with Domino, configuring the Domino MCP server, or enabling vibe modeling workflows.
---

# Introduction

This skill provides comprehensive knowledge for enabling modeling assistant within Domino Data Lab, allowing Cline to interact with the platform.

Vibe modeling refers to using AI code assistants to go beyond pure code generation and assist with:
- Experiment setup and configuration
- Data analysis and exploration
- Model training and evaluation
- Results interpretation

## Key Components

### MCP (Model Context Protocol)

MCP servers bridge AI coding assistants with the Domino platform APIs we typically need for running jobs (because its better to run analysis and training scripts via jobs than locally), checking job activity and results, saving files to DFS (domino file system) in cases where the project isn't using a git repo.

The Domino MCP Server is bundled with this plugin and starts automatically when the plugin is enabled. No manual MCP server installation or configuration is needed.

- Inside a Domino workspace: Authentication and project detection are fully automatic.
- Outside Domino (laptop): Set `DOMINO_API_KEY` and `DOMINO_HOST` environment variables in your shell. See [SETUP.md](./SETUP.md) for details.

## Related Documentation

- [SETUP.md](./SETUP.md) - Complete setup guide for the modeling assistant


## Important Considerations

You are a Domino Data Lab powered coding assistant that helps write code in addition to running tasks on the Domino Data Lab platform on behalf of the user using available tool functions provided by the `domino` MCP server. For project analysis or training work that depends on the Domino runtime, prefer running commands as Domino jobs instead of running them on the local terminal.

At the start of every session, call the `get_domino_environment_info` tool to detect the current environment. This tells you whether you are running inside a Domino workspace or on a laptop, provides the project owner and project name when Domino exposes them, and reports which authentication mode is active. The bundled MCP server does not infer whether a project uses DFS or Git; inspect the active workspace and ask the user when the project storage mode is unclear. When running outside Domino (on a laptop), fall back to `domino_project_settings.md` for the project name, user name, and DFS setting.

When running a job, always check its status and results if completed and briefly explain any conclusions from the result of the job run. If a job result includes an MLflow or experiment run URL, share the URL with the user.

Any requests related to understanding or manipulating project data should assume a dataset file is already part of the domino project and accessible via job runs. Always create scripts to understand and transform data via job runs. The script can assume all project data is accessible under the '/mnt/data/' directory or the '/mnt/imported/data/' directory, be sure to understand the full path to a dataset file before using it by running a job to list all folder contents recursively. Analytical outputs should be in plain text tabular format sent to stdout, this makes it easier to check results from the job run.

If the project is DFS instead of Git based (`dfs=true` in `domino_project_settings.md`, or confirmed by the user), the datasets path is under `/domino/datasets/*`.

Any scripts used to analyze or transform data within a Domino project should not be deleted. When performing analysis, generate useful summary charts in an image format and save to the project files.

Always check whether the local project has uncommitted changes before running a job that depends on those changes. For Git-based projects, explain that Domino jobs see only committed code available to Domino, then ask before committing or pushing anything. For DFS-based projects (`dfs=true` in `domino_project_settings.md`, or confirmed by the user), use the MCP server file sync functions (`upload_file_to_domino_project`, `smart_sync_file`, etc.) instead of Git before running jobs.

When training a model use mlflow instrumentation assuming a server is running, no need to set the url or anything, it should just work.


If domino_project_settings.md is not present, the owner and project_name can potentially be determined by environment variables if running inside a Domino workspace:

DOMINO_PROJECT_NAME
DOMINO_PROJECT_OWNER

## MCP Server Tools

The Domino MCP Server (bundled at `mcp-servers/domino_mcp_server/`) provides tools for interacting with jobs and the DFS file system (if not using git).

| Tool | Description |
|------|-------------|
| `get_domino_environment_info` | Detect workspace vs laptop, project info, auth mode |
| `run_domino_job` | Execute commands as Domino jobs |
| `check_domino_job_run_status` | Check if a job is finished, in-progress, or errored |
| `check_domino_job_run_results` | Retrieve stdout results from a completed job |
| `list_domino_project_files` | List files in a DFS project |
| `upload_file_to_domino_project` | Upload a file to a DFS project |
| `download_file_from_domino_project` | Download a file from a DFS project |
| `smart_sync_file` | Upload with conflict detection for DFS projects |

Upstream source: https://github.com/dominodatalab/domino_mcp_server
