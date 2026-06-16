---
name: appwrite-mcp
description: Use when deciding how to use the Appwrite MCP servers. Covers docs lookup, API MCP credential requirements, and safe Appwrite project mutation boundaries.
---

# Appwrite MCP

This plugin registers two MCP servers:

- `appwrite-docs` for Appwrite documentation lookup.
- `appwrite-api` for Appwrite project operations through the Appwrite MCP server when required credentials are available.

## Choosing A Server

- Use docs lookup for API references, SDK examples, migration questions, CLI command syntax, and best practices.
- Use the API MCP only when the user asks to inspect or change actual Appwrite project resources.
- If project state can be answered from local files, inspect the workspace before calling the API MCP.

## API MCP Setup

The API MCP requires these environment variables when the plugin is installed or reinstalled:

```bash
APPWRITE_ENDPOINT=https://<REGION>.cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=<PROJECT_ID>
APPWRITE_API_KEY=<API_KEY>
```

If any value is missing, Cline skips `appwrite-api` and keeps the docs MCP and skills installed.

## Safe Use

- Treat API MCP calls as authenticated access to the target Appwrite project.
- Prefer read-only inspection before mutation.
- Confirm target endpoint, project ID, and resource IDs before making changes.
- Ask for explicit user confirmation before deletes, deployment changes, permission changes, auth provider changes, function executions, or bulk writes.
- Do not expose API keys in prompts, logs, files, or summaries.
