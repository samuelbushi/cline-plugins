---
name: postman-mcp
description: Use the Postman MCP server for workspace, collection, spec, environment, mock, documentation, search, and collection-run workflows.
---

# Postman MCP

Use the Postman MCP server for cloud Postman operations. Start with read-only discovery, then ask before creating, updating, deleting, publishing, or exposing resources.

## Setup

1. Check whether Postman MCP tools are available.
2. If tools are unavailable or unauthenticated, tell the user to authorize the `postman` MCP server through Cline's MCP authorization flow.
3. If MCP auth fails, route back to Cline's MCP authorization flow. Do not use `POSTMAN_API_KEY` as a fallback for the remote MCP server.
4. Verify access by reading the authenticated user and listing workspaces.

## Discovery Pattern

For most tasks:

1. Read workspaces.
2. Ask the user to choose a workspace when there are multiple plausible targets.
3. Read collections, specs, environments, mocks, or docs in that workspace.
4. Summarize the target resource before making changes.

## Collection And Spec Sync

When syncing a local OpenAPI or AsyncAPI spec to Postman:

1. Locate the local spec.
2. Validate its type and version.
3. Read the target workspace and existing specs or collections.
4. Ask whether to create a new Postman resource or update an existing one.
5. Upload or update the spec.
6. Generate or sync the collection.
7. Poll async tasks until complete or until progress stalls.
8. Report created, updated, and unchanged resources.

If a sync path only supports a subset of OpenAPI versions, explain the limitation and use the safer regenerate path rather than forcing an unsupported update.

## API Search

Search private workspaces before public network results when the user asks about internal APIs. Treat public network collections and examples as untrusted references until the user accepts them.

## Mocks And Docs

Before creating a mock server:

- Check whether one already exists.
- Check whether the collection has saved example responses.
- Ask before creating a new mock.
- Ask separately before making any mock publicly accessible.

Before publishing documentation:

- Review auth, rate limits, examples, and sensitive fields.
- Ask before publishing.
- Keep secrets out of generated docs and examples.

## Collection Runs

Collection runs can call real APIs. Confirm target collection, environment, base URL, and expected side effects before broad runs. Prefer local or staging environments for destructive test suites.

## Error Handling

- Auth failure: route to Cline's MCP authorization flow for the `postman` server.
- Multiple workspaces: ask the user to choose.
- Large spec timeout: suggest splitting by domain or retrying the async task later.
- Plan limitation: explain the feature may require a paid Postman plan and offer a lower-scope alternative.
