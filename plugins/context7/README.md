# context7

Adds the Context7 documentation MCP server to Cline.

## What It Does

Registers a `context7` MCP server backed by `@upstash/context7-mcp`. Context7 helps Cline look up version-specific library documentation and code examples while working on implementation tasks.

## Install

```bash
cline plugin install context7
```

For local development from this repository:

```bash
cline plugin install ./plugins/context7 --cwd .
```

## Example Usage

After installation, ask Cline:

```text
Use Context7 to check the current TanStack Query mutation API, then update this component without guessing.
```

Cline can use the MCP tools contributed by Context7 when it needs package documentation or examples.

## Requirements

- Node.js and `npx` available on PATH.
- Network access to download and run `@upstash/context7-mcp` on first use.

## Security Notes

This plugin starts a local MCP server through `npx -y @upstash/context7-mcp`. The server may receive package names, documentation queries, and surrounding task context that Cline sends to its MCP tools. Avoid sending private code, secrets, or customer data unless you are comfortable with the Context7 server handling that content.
