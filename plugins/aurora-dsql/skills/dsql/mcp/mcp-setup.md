## Cline Plugin Default Configuration

This Cline plugin registers the `aws-knowledge` MCP server by default. Use it to search AWS service knowledge and verify Aurora DSQL limits.

The Aurora DSQL database MCP server is not registered automatically. It needs user-selected cluster details and an explicit write-mode decision. Add it to Cline MCP settings manually only when the user wants database operations.

### Default MCP From This Plugin

The plugin-owned MCP registration is:

```json
{
  "mcpServers": {
    "aws-knowledge": {
      "transport": {
        "type": "stdio",
        "command": "uvx",
        "args": [
          "mcp-proxy-for-aws@1.6.0",
          "https://knowledge-mcp.global.api.aws",
          "--skip-auth",
          "--metadata",
          "INSTALL_SOURCE=cline-plugin"
        ]
      }
    }
  }
}
```

Do not edit the plugin for database access. Add a separate user-managed `aurora-dsql` MCP server in Cline MCP settings when needed.

---

# MCP Server Setup Instructions

## Prerequisites:

```bash
uv --version
```

If missing:

- Install from: [Astral](https://docs.astral.sh/uv/getting-started/installation/)

## User-Managed Aurora DSQL MCP Configuration

The plugin-owned `aws-knowledge` MCP server already covers documentation and service-limit lookup. Add the user-managed `aurora-dsql` MCP server only when the user wants to connect to an Aurora DSQL cluster.

### Read-Only Database Configuration

```json
{
  "mcpServers": {
    "aurora-dsql": {
      "transport": {
        "type": "stdio",
        "command": "uvx",
        "args": [
          "awslabs.aurora-dsql-mcp-server@latest",
          "--cluster_endpoint",
          "[your dsql cluster endpoint, e.g. abcdefghijklmnopqrst234567.dsql.us-east-1.on.aws]",
          "--region",
          "[your dsql cluster region, e.g. us-east-1]",
          "--database_user",
          "[your dsql username, e.g. admin]",
          "--profile",
          "[your aws profile name, eg. default]"
        ],
        "env": {
          "FASTMCP_LOG_LEVEL": "ERROR",
          "REGION": "[your dsql cluster region, eg. us-east-1, only when necessary]",
          "AWS_PROFILE": "[your aws profile name, eg. default]"
        }
      },
      "disabled": false
    }
  }
}
```

This configuration enables read-only queries, schema exploration, DSQL documentation tools, and linting. It does not enable `transact`.

### Optional Write Mode

Add `--allow-writes` to the `args` array only after the user explicitly asks for write operations and accepts the risk. With write mode enabled, the MCP server can execute DDL and DML through `transact`.

### Optional Arguments and Environment Variables:

The following args and environment variables are not required, but may be required if the user
has custom AWS configurations or would like to allow/disallow the MCP server mutating their database.

- Arg: `--profile` or Env: `"AWS_PROFILE"` only need
  to be configured for non-default values.
- Env: `"REGION"` when the cluster region management is
  distinct from user's primary region in project/application.
- Arg: `--allow-writes` enables `transact` for DDL and DML. Always ask the user if writes should be allowed.

## Cline Guidance

When adding the user-managed Aurora DSQL MCP server, explain the exact permissions and write-mode consequences before changing settings. Keep `--allow-writes` out unless the user explicitly asks for write operations and accepts the risk.

## Additional Documentation

- [MCP Server Setup Guide](https://awslabs.github.io/mcp/servers/aurora-dsql-mcp-server)
- [DSQL MCP User Guide](https://docs.aws.amazon.com/aurora-dsql/latest/userguide/SECTION_aurora-dsql-mcp-server.html)
