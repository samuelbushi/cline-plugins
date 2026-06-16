# prisma

Register the Prisma MCP server in Cline.

## What It Does

Adds the `prisma` MCP server at `https://mcp.prisma.io/mcp`.

The server gives Cline access to Prisma's MCP tools for Prisma Postgres and related Prisma workflows supported by that endpoint.

## Install

```bash
cline plugin install prisma
```

For local development from this repository:

```bash
cline plugin install ./plugins/prisma --cwd .
```

## Example Usage

After installation, ask Cline:

```text
Use Prisma to inspect this project's database schema and suggest the next migration.
```

Cline can use the registered Prisma MCP server when it is available in the MCP runtime.

## Requirements

- Network access to `https://mcp.prisma.io/mcp`.
- Prisma account, project, and database requirements depend on the Prisma MCP tools you use.

## Security Notes

Prisma MCP tools can inspect or change database resources depending on your account and selected action. Review requested tool calls before allowing mutations.
