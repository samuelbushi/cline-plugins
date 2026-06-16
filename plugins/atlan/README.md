# atlan

Adds the Atlan MCP server to Cline.

## What It Does

Registers an `atlan` MCP server at `https://mcp.atlan.com/mcp`. The Atlan MCP server helps Cline work with data catalog, metadata, lineage, glossary, data quality, and governance workflows available to the authenticated Atlan account.

## Install

```bash
cline plugin install atlan
```

For local development from this repository:

```bash
cline plugin install ./plugins/atlan --cwd .
```

## Example Usage

After installation, ask Cline:

```text
Use Atlan to find customer-related tables and summarize their upstream lineage.
```

Cline can use the registered Atlan MCP server when it is available in the MCP runtime.

## Requirements

- Network access to `https://mcp.atlan.com/mcp`.
- An Atlan account with access to the assets, glossaries, and metadata you want Cline to inspect or update.
- OAuth authorization through Cline's MCP auth flow when required by the Atlan MCP server.

## Security Notes

Atlan MCP tools can read or change metadata depending on your Atlan permissions and the selected tool call. Review requested actions before allowing updates to catalog assets, glossary terms, data quality rules, or related governance data.
