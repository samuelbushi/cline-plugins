# codspeed

Adds the CodSpeed MCP server to Cline.

## What It Does

Registers a `codspeed` MCP server at `https://mcp.codspeed.io/mcp`. The CodSpeed MCP server helps Cline inspect CodSpeed benchmark runs, compare performance changes, and analyze flamegraph data available to the authenticated CodSpeed account.

## Install

```bash
cline plugin install codspeed
```

For local development from this repository:

```bash
cline plugin install ./plugins/codspeed --cwd .
```

## Example Usage

After installation and any required CodSpeed authorization, ask Cline:

```text
Use CodSpeed to compare the latest benchmark run against main and identify the hottest regression.
```

Cline can use the registered CodSpeed MCP server when it is available in the MCP runtime.

## Requirements

- Network access to `https://mcp.codspeed.io/mcp`.
- A CodSpeed account with access to the projects and benchmark runs you want Cline to inspect.
- OAuth authorization through Cline's MCP auth flow when required by the CodSpeed MCP server.
- No existing manual MCP server named `codspeed`. If one already exists, Cline leaves the manual entry alone and the plugin does not replace it.

## Security Notes

CodSpeed MCP tools can read benchmark metadata, run comparisons, flamegraph details, and related project performance data depending on your account permissions and selected tool call. Review requested actions before allowing changes to benchmark configuration, CI setup, or project performance workflows.
