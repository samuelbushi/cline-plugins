# Nimble Setup

Use this setup flow when a Nimble skill cannot access live Nimble tools.

## Preferred Cline Setup

```bash
cline plugin install nimble
```

This plugin registers the `nimble` MCP server. The user should complete OAuth through Cline's MCP authorization flow when prompted.

If a Nimble MCP tool returns an authorization URL or an auth/not-connected error:

1. Present the authorization guidance or URL exactly.
2. Stop and wait for the user to complete authorization.
3. Retry with one read-only Nimble MCP call.

Do not invent a completion flow and do not ask the user to paste redirected browser URLs.

## CLI Fallback

Use the CLI only when the user wants shell-based workflows or the MCP tool surface is not enough:

```bash
npm i -g @nimble-way/nimble-cli
export NIMBLE_API_KEY=<set outside chat>
nimble --version
```

Never ask the user to paste the key into chat. Reference `$NIMBLE_API_KEY` in commands.

## No Transport Available

If neither MCP nor CLI is available, stop and guide setup. Do not substitute unrelated web search, fetch, curl, or HTTP libraries for Nimble workflows.
