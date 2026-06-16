# shopify

Adds the Shopify Dev MCP server to Cline.

## What It Does

Registers a `shopify-mcp` MCP server backed by the pinned `@shopify/dev-mcp` package. The Shopify Dev MCP server helps Cline work with Shopify developer docs, GraphQL APIs, Liquid, Functions, themes, and UI extension guidance.

## Install

```bash
cline plugin install shopify
```

For local development from this repository:

```bash
cline plugin install ./plugins/shopify --cwd .
```

## Example Usage

After installation, ask Cline:

```text
Use Shopify docs to validate this Admin API mutation and explain the required fields.
```

Cline can use the registered Shopify MCP server when it needs Shopify documentation, API schemas, or validation help.

## Requirements

- Node.js 20.10 or newer available on PATH.
- Network access during installation to download `@shopify/dev-mcp` and its dependencies.
- Network access during use for Shopify documentation lookups when the MCP server needs remote docs.

## Security Notes

This plugin starts a local MCP server through the bundled `@shopify/dev-mcp` package. The server may receive prompts, code snippets, GraphQL operations, Liquid/theme snippets, and surrounding task context that Cline sends to its MCP tools. Avoid sending secrets, customer data, or private store data unless you are comfortable with the Shopify MCP server handling that content.
