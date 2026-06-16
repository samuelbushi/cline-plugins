# planetscale

Adds the PlanetScale MCP server to Cline.

## What It Does

Registers a `planetscale` MCP server at `https://mcp.pscale.dev/mcp/planetscale`. The PlanetScale MCP server helps Cline work with PlanetScale organizations, databases, branches, schema, and Insights data available to the authenticated PlanetScale account.

## Install

```bash
cline plugin install planetscale
```

For local development from this repository:

```bash
cline plugin install ./plugins/planetscale --cwd .
```

## Example Usage

After installation and any required PlanetScale authorization, ask Cline:

```text
Use PlanetScale to inspect this database schema and explain which tables are related to billing.
```

Cline can use the registered PlanetScale MCP server when it is available in the MCP runtime.

## Requirements

- Network access to `https://mcp.pscale.dev/mcp/planetscale`.
- A PlanetScale account with access to the organizations, databases, branches, schema, and Insights data you want Cline to inspect.
- OAuth authorization through Cline's MCP auth flow when required by the PlanetScale MCP server.
- No existing manual MCP server named `planetscale`. If one already exists, Cline leaves the manual entry alone and the plugin does not replace it.

## Security Notes

PlanetScale MCP tools can read database metadata and operational data depending on your account permissions and the selected tool call. Review requested actions before allowing changes to databases, branches, schema, or other PlanetScale resources.
