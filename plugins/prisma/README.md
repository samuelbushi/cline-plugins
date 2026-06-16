# prisma

Register Prisma MCP servers for database workflows in Cline.

## What It Does

Adds two MCP servers:

- `prisma-local`: runs `npx -y prisma mcp` as a local stdio server.
- `prisma-remote`: connects to the hosted Prisma MCP endpoint over streamable HTTP.

Together they let Cline work with Prisma database workflows such as schema changes, SQL queries, migrations, and connection management when the selected Prisma MCP server supports those actions.

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

Cline can use the registered Prisma MCP servers when they are available in the MCP runtime.

## Requirements

- Node.js and `npx` for the local Prisma MCP server.
- Network access for the hosted Prisma MCP server.
- Prisma project, database, and account requirements depend on the Prisma MCP server and tools you use.

## Security Notes

The local server runs through `npx`, which can download and execute the Prisma package. Review Prisma project settings and credentials before allowing database mutations.
