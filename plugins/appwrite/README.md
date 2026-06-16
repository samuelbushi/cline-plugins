# Appwrite

Appwrite MCP, skills, commands, and guardrails for building, querying, and deploying Appwrite-backed applications from Cline.

## What It Adds

- `appwrite-docs` MCP server for Appwrite documentation lookup over Streamable HTTP.
- `appwrite-api` MCP server for Appwrite project operations through `uvx mcp-server-appwrite`.
- 15 bundled skills:
  - `appwrite-cli` for Appwrite CLI setup, login, project initialization, pull, push, and non-interactive workflows.
  - `appwrite-sdk` as a compatibility router for general SDK requests.
  - `appwrite-typescript-sdk`, `appwrite-dart-sdk`, `appwrite-kotlin-sdk`, and `appwrite-swift-sdk` for client/mobile/server SDK work.
  - `appwrite-python-sdk`, `appwrite-ruby-sdk`, `appwrite-go-sdk`, `appwrite-rust-sdk`, `appwrite-dotnet-sdk`, and `appwrite-php-sdk` for server SDK work.
  - `appwrite-tablesdb` for TablesDB schema, row, query, permissions, and migration decisions.
  - `appwrite-deployments` for guarded site and function deployment workflows.
  - `appwrite-mcp` for choosing between the docs MCP and API MCP safely.
- `/appwrite-deploy-function` and `/appwrite-deploy-site` commands for guided deployment preparation.
- A safety rule for Appwrite project mutations, deployments, permissions, function executions, API keys, session secrets, and credential-bearing config.

## Install

```bash
cline plugin install appwrite
```

For local development from this repository:

```bash
cline plugin install ./plugins/appwrite --cwd .
```

The docs MCP does not need Appwrite credentials. The API MCP reads these environment variables when the plugin is installed or reinstalled:

```bash
APPWRITE_ENDPOINT=https://<REGION>.cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=<PROJECT_ID>
APPWRITE_API_KEY=<API_KEY>
```

If any of those variables are missing, Cline skips `appwrite-api` and still installs the docs MCP and skills. Set the variables and reinstall the plugin to add the API MCP.

## Requirements

- Cline with plugin MCP registration support.
- Network access to `https://mcp-for-docs.appwrite.io` for docs lookup.
- `uvx` available on `PATH` for the API MCP.
- An Appwrite endpoint, project ID, and least-privilege API key for the API MCP.
- Appwrite CLI installed and authenticated before using deployment workflows.

## Security Notes

The API MCP can read or mutate Appwrite project resources according to the API key scopes. Use the narrowest API key that fits the task, keep it out of source control, and avoid exposing it in logs.

Deployment, delete, push, and other irreversible Appwrite operations require explicit user confirmation. Cline should inspect the local `appwrite.config.json`, summarize the intended changes, and only run the command after the user approves the exact target and command.
