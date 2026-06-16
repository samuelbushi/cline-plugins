# railway

Operate Railway projects, services, deployments, variables, domains, databases, object storage buckets, logs, metrics, and docs from Cline.

## Cline Primitives

- MCP: registers the local Railway CLI MCP server with `railway mcp`. This exposes Railway platform tools backed by the user's installed and authenticated Railway CLI.
- Skill: installs `use-railway`, a Railway operations workflow skill with references for setup, deploys, configuration, operations, sandbox usage, API fallbacks, and database analysis.
- Rule: adds Railway safety guidance so Cline asks before deployments, account flows, resource mutations, database access, token reads, long-running collection, and GraphQL API fallbacks.

## Install

```bash
cline plugin install railway
```

For local development from this repository:

```bash
cline plugin install ./plugins/railway --cwd .
```

## Example Usage

After installation, ask Cline:

```text
Check the status of my Railway service, inspect the latest failed deployment logs, and suggest the next fix.
```

Cline can use the Railway MCP server for platform operations and the `use-railway` skill for setup, deploy, configuration, operations, sandbox, API fallback, and database analysis workflows.

## Requirements

- Railway CLI installed with `railway mcp` support.
- A Railway account and local CLI authentication for account-scoped work.
- Project-scoped `RAILWAY_TOKEN` or account-scoped `RAILWAY_API_TOKEN` only when the user intentionally wants unattended workflows. The bundled GraphQL helper reads these variables before falling back to the local Railway CLI config.
- `jq`, `curl`, and Python 3 for the bundled GraphQL and database analysis helpers.
- Database/network permissions when using the optional analysis scripts.

## Security Notes

The plugin does not run Railway commands during installation and does not port the source auto-approval hook. Railway actions can create billable resources, deploy local code, open browser or device-code auth flows, read local Railway CLI credentials, call Railway's API, inspect logs, and query databases, so Cline should show the action and ask first.

## Attribution

The bundled Railway workflow skill is derived from `railwayapp/railway-skills`, whose plugin manifest declares MIT licensing. See `NOTICE.railway-skills`.
