# serena

Use Serena from Cline for semantic code analysis, symbol-aware navigation, and refactoring assistance through an MCP server.

## What It Does

This plugin registers the `serena` MCP server. The server runs in the current workspace so its codebase navigation and symbol-analysis tools inspect the user's project rather than the installed plugin package.

## Install

```bash
cline plugin install serena
```

For local development from this repository:

```bash
cline plugin install ./plugins/serena --cwd .
```

## Example Usage

After installation, ask Cline:

```text
Use Serena to inspect the symbol relationships around this service before we refactor it.
```

```text
Use Serena to find likely callers of this function and summarize the safest change plan.
```

Cline can call Serena MCP tools when it needs symbol-aware codebase navigation and semantic context.

## Requirements

Requires `uvx` on the user's PATH. The MCP server runs through:

```bash
uvx --from serena-agent==1.5.3 serena start-mcp-server
```

First use can require network access while `uvx` downloads the pinned `serena-agent` package and its Python dependencies.

## Security Notes

Serena inspects the current workspace through language-server-style analysis and may provide refactoring guidance. Review proposed source edits normally before applying them to sensitive or untrusted projects.

The plugin does not store credentials or write MCP settings outside Cline's plugin-owned MCP registration flow.
