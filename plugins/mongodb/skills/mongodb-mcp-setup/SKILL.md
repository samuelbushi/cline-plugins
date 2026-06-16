---
name: mongodb-mcp-setup
description: Guide users through configuring the MongoDB MCP server for Cline, including connection-string auth, Atlas API credentials, Atlas Local, and read-only mode.
---

# MongoDB MCP Setup

Help the user configure MongoDB MCP access without handling secrets directly.

## Configuration Options

1. Connection string: use `MDB_MCP_CONNECTION_STRING` for direct access to one deployment. Good for existing database users, self-managed MongoDB, local MongoDB, or one Atlas cluster.
2. Atlas API credentials: use `MDB_MCP_API_CLIENT_ID` and `MDB_MCP_API_CLIENT_SECRET` for Atlas workflows such as project discovery, cluster inspection, Performance Advisor, and dynamic cluster connection.
3. Atlas Local: use Docker-backed local Atlas workflows when the user wants a local development deployment and no cloud credentials.

Ask which option fits the user before giving setup steps.

## Credential Rules

- Do not ask the user to paste credentials into chat.
- Do not write credentials to files unless the user explicitly asks for the exact file edit.
- Do not echo credential values in commands or responses.
- The plugin defaults `MDB_MCP_READ_ONLY` to `true`. Keep it that way for production, shared, or unfamiliar data.
- Set `MDB_MCP_READ_ONLY=false` only when the user explicitly wants writable MCP tools and understands the impact.
- If the user needs Atlas administration but only has `MDB_MCP_CONNECTION_STRING`, explain that Atlas API credentials are required for those tools.

## Cline Setup

Tell the user to configure the environment that launches Cline before installing, re-enabling, or reinstalling this plugin. The plugin owns the `mongodb` MCP entry, so do not create a second MCP server with the same name.

For connection-string access:

```bash
export MDB_MCP_CONNECTION_STRING="<mongodb-or-mongodb+srv-uri>"
# Read-only is the plugin default. Set this only when intentionally enabling writes:
# export MDB_MCP_READ_ONLY="false"
```

For Atlas API access:

```bash
export MDB_MCP_API_CLIENT_ID="<atlas-service-account-client-id>"
export MDB_MCP_API_CLIENT_SECRET="<atlas-service-account-client-secret>"
# Read-only is the plugin default. Set this only when intentionally enabling writes:
# export MDB_MCP_READ_ONLY="false"
```

For Atlas Local:

```bash
docker info
```

If Docker is unavailable, direct the user to install Docker before using Atlas Local MCP tools.

## Atlas Service Account Checklist

1. Open MongoDB Atlas.
2. Select the organization or project.
3. Create a service account with the least permissions needed for the workflow.
4. Generate the client ID and client secret.
5. Add the current IP or CIDR to the service account API access list.
6. Avoid `0.0.0.0/0` except for temporary testing, and remove it immediately afterward.

## Verification

After the user configures credentials, ask them to restart or reload Cline if needed. Then use read-only MCP calls first:

1. List projects or databases.
2. Inspect a harmless collection or cluster.
3. Confirm read-only mode before touching production data.
