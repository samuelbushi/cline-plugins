---
name: postman-setup
description: Set up and verify Postman MCP access in Cline, including workspace discovery and auth recovery guidance.
---

# Postman Setup

Use this skill when the user is setting up Postman for the first time, MCP tools are missing, authentication fails, or the user wants to confirm which workspace Cline can access.

## Cline MCP Setup

1. Check whether Postman MCP tools are available.
2. If the tools are unavailable, tell the user to authorize the `postman` MCP server through Cline's MCP authorization flow.
3. Do not ask the user to paste Postman API keys into chat for the remote MCP server. The plugin registers the remote Postman MCP endpoint; authentication should happen through Cline's MCP auth UI.
4. After authorization, verify access by reading the authenticated user and listing workspaces.

## Verification

After the MCP server is connected:

1. Read the authenticated Postman user.
2. List workspaces.
3. For the likely workspace, list collections and specs.
4. If multiple workspaces are plausible, ask which workspace should be used for the current task.

Report the result without exposing tokens, environment values, cookies, or request secrets:

```text
Connected as: <user name>

Available workspaces:
- My Workspace (personal): 12 collections, 3 specs
- Team APIs (team): 8 collections, 5 specs
```

## Local CLI Setup

Only use `POSTMAN_API_KEY`, `postman login`, or `npm install -g postman-cli` for local Postman CLI workflows, and only after the user asks for local CLI execution or approves the specific setup step.

Use `postman-cli`, `postman-send-request`, or `postman-run-collection` for local CLI details.

## Troubleshooting

- MCP tools unavailable: confirm the plugin is installed, then have the user authorize the `postman` MCP server in Cline and restart the session if needed.
- Auth failure: route back to Cline's MCP authorization flow for the `postman` server.
- Multiple workspaces: ask the user to choose a workspace before modifying resources.
- Empty workspace: offer `postman-sync` for importing a local OpenAPI spec, or `postman-search` for discovering APIs.
- Network timeout: check network access and Postman service status before retrying.
- Plan limitation: explain which action may require a paid Postman plan and offer a lower-scope alternative.
