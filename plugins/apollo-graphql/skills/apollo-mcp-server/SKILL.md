---
name: apollo-mcp-server
description: Configure Apollo MCP Server to expose GraphQL APIs to AI agents, including operation sources, persisted queries, schema introspection, auth, headers, compact notation, and safe tool boundaries.
---

# Apollo MCP Server

Use this skill when the user wants to expose a GraphQL API as MCP tools or debug Apollo MCP Server.

## Workflow

1. Identify the GraphQL endpoint, operation source, authentication model, and runtime target.
2. Prefer explicit operation files, persisted queries, or GraphOS-managed operations over unconstrained schema introspection for production use.
3. Define only the tools the agent needs. Keep names, descriptions, variables, and response shapes clear.
4. Configure headers and tokens through environment variables or secret managers.
5. Validate the MCP server locally before connecting it to a real agent workflow.
6. Document what the agent can read or mutate and which API auth identity it uses.

## Safe Defaults

- Start read-only when exploring a graph.
- Add mutations only after the user confirms the use case and permissions.
- Use persisted operations where available.
- Keep destructive or expensive operations out of the initial tool surface.
- Add health checks and simple smoke prompts for local validation.

## Guardrails

- Do not expose an entire production graph without discussing risk.
- Do not hardcode tokens, cookies, or private headers.
- Do not route user-provided arbitrary GraphQL strings to production unless the user explicitly asks and accepts the risk.
