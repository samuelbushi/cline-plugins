# cds-mcp

Adds the SAP CAP MCP server to Cline.

## What It Does

Registers a `cds-mcp` MCP server backed by the pinned `@cap-js/mcp-server` package. The CAP MCP server helps Cline search CDS model definitions in the current workspace and search SAP Cloud Application Programming Model documentation.

## Install

```bash
cline plugin install cds-mcp
```

For local development from this repository:

```bash
cline plugin install ./plugins/cds-mcp --cwd .
```

## Example Usage

After installation in a CAP project workspace, ask Cline:

```text
Use cds-mcp to find the services and entities in this CAP project before changing the model.
```

Cline can use the registered CAP MCP server when it is available in the MCP runtime.

## Requirements

- Node.js available on PATH.
- Network access during installation to download `@cap-js/mcp-server` and its dependencies.
- A SAP CAP project workspace when using model-search tools.
- No existing manual MCP server named `cds-mcp`. If one already exists, Cline leaves the manual entry alone and the plugin does not replace it.

## Security Notes

The CAP MCP server runs locally and can inspect CDS model files in the workspace where the plugin was installed. Documentation search uses local package data and model search reads project files. Review requested actions before allowing changes to CAP models, services, or project configuration.
