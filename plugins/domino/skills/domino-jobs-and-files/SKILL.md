---
name: domino-jobs-and-files
description: Use Domino MCP tools for job runs and DFS project files. Use when running Domino jobs, checking run output, listing DFS files, downloading project files, uploading changes, or resolving file sync conflicts.
---

# Domino Jobs And Files

Use the `domino` MCP tools for Domino job and DFS file workflows.

## Start with environment info

Call `get_domino_environment_info` first. Prefer detected `user_name` and `project_name` when they are present. If Cline is outside Domino, ask the user for the project owner and project name before running project-scoped tools.

## Job workflow

1. Confirm the command, project owner, project name, and job title with the user.
2. Call `run_domino_job`.
3. Poll `check_domino_job_run_status` until the job completes or fails.
4. Call `check_domino_job_run_results` for stdout and generated MLflow links.
5. Report job IDs, status, important logs, and next actions.

Do not launch a job just to test connectivity. Use `get_domino_environment_info` for low-risk checks.

## DFS file workflow

Use DFS file tools only for non-Git Domino projects.

- Read-only discovery: `list_domino_project_files`.
- Read a file and establish a conflict baseline: `download_file_from_domino_project`.
- Create or replace a file with explicit content: `upload_file_to_domino_project`.
- Prefer `smart_sync_file` for shared projects because it detects remote changes before writing.

## Conflict handling

When `smart_sync_file` returns `conflict: true`:

1. Show a concise comparison of the remote content and proposed content.
2. Ask the user whether to merge, abandon, or overwrite.
3. Use `force_overwrite: true` only after explicit confirmation.

## Safety

Read local files through normal Cline file tools before passing content to Domino MCP tools. Never use DFS tools against secrets, credentials, or files outside the user's intended project. Never force overwrite remote content by default.
