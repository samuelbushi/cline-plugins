---
name: build-mcp-server
description: Design and build MCP servers, including deployment shape, tool schemas, auth boundaries, resources, prompts, and testing strategy.
---

# Build MCP Server

Use this skill when the user asks to build an MCP server, create an MCP integration, wrap an API as MCP tools, expose workspace or service operations to Cline, or decide how an MCP server should be deployed.

Start with discovery. Picking the wrong deployment shape early usually causes more rework than the tool implementation.

## Discovery

Answer these before coding:

1. What system is being exposed: cloud API, database, local files, localhost service, desktop app, hardware, or internal workflow?
2. Who will use it: just this workspace, one developer, a team, or public users?
3. Does it need user auth, workspace credentials, OAuth, service credentials, or no auth?
4. How many actions are needed: a few precise tools or a large API surface?
5. Are actions read-only, idempotent writes, or destructive writes?
6. Does the user need interactive UI? If yes, hand off to an MCP Apps workflow instead of inventing custom protocol behavior.

## Deployment Choice

Prefer:

- Remote streamable HTTP for cloud APIs, SaaS integrations, team usage, OAuth, and public distribution.
- Workspace-local stdio for prototypes, one-off internal tools, or servers that are launched from a known project.
- Packaged local distribution only when the server must access local files, desktop apps, localhost services, hardware, or OS APIs on the user's machine.

Avoid local stdio distribution for cloud-only APIs. It gives users more installation burden without improving the integration.

## Tool Design

Good MCP tools are narrow and predictable:

- Name tools with clear verbs and stable resource nouns.
- Split read tools from write tools.
- Mark read-only, destructive, idempotent, and open-world behavior with annotations when the SDK supports them.
- Give every parameter a description and validate every input server-side.
- Return identifiers, statuses, and next-step hints that the model can use.
- Return structured tool errors instead of crashing the transport.
- Keep large API surfaces behind discovery patterns such as `search_operations` plus `execute_operation` rather than exposing hundreds of tools.

## Auth And Secrets

Use the deployment shape to decide where secrets live:

- Remote server: store user tokens server-side in a session or account store and validate token audience.
- Local server: prefer environment variables, OS keychain, or user-configured secret storage. Never plaintext token files.
- OAuth: make the redirect, refresh, revocation, and token ownership story explicit before scaffolding.

Never forward a host token to an unrelated upstream API as token passthrough. Exchange it or use credentials minted for the upstream service.

## Resources And Prompts

Reach for MCP resources when the client should browse or attach reference data without invoking an action. Reach for prompts when users need reusable, parameterized workflows surfaced by the host.

Do not force everything into tools. If the operation is not model-initiated, a resource, prompt, or host UI may be a better fit.

## Implementation Steps

1. Confirm deployment shape and runtime.
2. Add dependencies with the project package manager.
3. Scaffold the server entrypoint and transport.
4. Implement one read-only tool first.
5. Add auth and secret handling before adding write tools.
6. Add write tools with explicit confirmation or dry-run behavior when appropriate.
7. Add resources or prompts only when their workflow is clear.
8. Test with a local MCP inspector or the target MCP host.
9. Document install, auth, environment variables, and safety limits.

## Before Finishing

Verify:

- The server starts cleanly from the documented command or URL.
- Tool schemas are narrow enough for reliable model use.
- Errors are recoverable and do not crash the transport.
- Secrets are not written to repo files or logs.
- Destructive operations require clear user intent.
- The README explains how Cline users connect the server.
