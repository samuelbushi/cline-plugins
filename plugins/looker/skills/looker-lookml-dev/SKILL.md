---
name: looker-lookml-dev
description: Inspect LookML development state through looker_toolbox_read, including projects, branches, files, validation, tests, and connection metadata.
---

# Looker LookML Development

Use this skill for read-only LookML project inspection, schema discovery, validation, tests, and branch awareness.

The `looker_toolbox_read` tool requires Looker API credentials in the Cline process environment. Never echo `LOOKER_CLIENT_SECRET` or persist it into project files.

## Safe Workflow

Prefer this order:

1. `get_projects` to find the project id.
2. `get_git_branch` and `list_git_branches` to understand current state.
3. Read current project files with `get_project_files`, `get_project_directories`, and `get_project_file`.
4. Run `validate_project` and, when relevant, `get_lookml_tests` or `run_lookml_tests`.
5. Summarize issues and propose the smallest safe change plan for the user to approve.

## Schema Discovery

Use these operations to inspect warehouse metadata exposed through Looker connections:

- `get_connections`
- `get_connection_databases`
- `get_connection_schemas`
- `get_connection_tables`
- `get_connection_table_columns`

This plugin does not generate views or modify LookML files. Use schema discovery to propose LookML, then ask the user how they want to apply it.

## Branch And File Inspection

For new work:

1. Inspect the current branch and files.
2. Validate the project.
3. Propose file-level edits in chat or local workspace files only when the user asks.
4. Tell the user what should be reviewed or deployed in Looker.

Keep generated LookML small and idiomatic. Do not claim this plugin wrote to Looker unless the user uses another approved write path.
