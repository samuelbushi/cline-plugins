---
name: cline-plugin-mcp
description: This skill should be used when the user asks to register an MCP server from a Cline plugin, choose stdio versus SSE versus streamable HTTP transport, handle OAuth or API keys, port MCP configuration, or review plugin-owned MCP settings.
---

# Cline Plugin MCP Integration

Use this skill to register MCP servers in a way that is useful, unsurprising, and cleanly owned by the installed plugin.

## When MCP Is The Right Primitive

Use MCP when the plugin exposes a coherent external service or local capability with multiple tools:

- Databases
- Cloud APIs
- Documentation search
- Browser automation
- SaaS workspaces
- Local analysis servers

Do not register multiple MCP servers just because the plugin you are adapting offered multiple variants. Pick the one that creates the clearest installed experience.

## Registration

Cline plugins register MCP servers during setup:

```ts
const plugin: AgentPlugin = {
  name: "docs-example",
  manifest: {
    capabilities: ["mcp"],
  },
  setup(api) {
    api.registerMcpServer({
      name: "docs-example",
      transport: {
        type: "streamableHttp",
        url: "https://example.com/mcp",
      },
    })
  },
}
```

Use the transport shape supported by the target Cline SDK. Check nearby plugins and the current Cline source before assuming a transport field.

## Transport Decisions

Use remote HTTP or SSE when the provider offers an official hosted endpoint and auth is handled cleanly by Cline's MCP flow.

Use stdio when the server is a local package, local CLI, Docker image, or project-specific command.

For stdio servers:

- Pin package versions when using plugin-installed dependencies.
- Prefer package-local binaries when the plugin owns the dependency.
- Use `npx`, `uvx`, or Docker only when that is the natural user-facing distribution path.
- Do not start the server during plugin setup. Registration is enough.

## Authentication

Avoid writing API keys into plugin-owned MCP settings. Prefer:

- Cline MCP OAuth for hosted servers that support it.
- Process environment inheritance for local stdio servers when that is acceptable.
- A user-managed MCP settings entry when the server requires static headers and no clean plugin auth path exists.

If a plugin cannot safely configure auth, ship skills or commands that guide setup instead of auto-registering a misleading MCP server.

## Settings Ownership

Plugin-owned MCP entries should appear when the plugin is installed or enabled and disappear when it is uninstalled or disabled. The user's hand-authored MCP settings should not be the primary place for plugin inventory.

Still think from the user's perspective:

- A plugin uninstall should not leave mystery servers behind.
- A plugin install should not persist secrets accidentally.
- A disabled plugin should not expose active tools.
- Name collisions should be handled predictably.

## Review Checklist

Before shipping an MCP plugin:

- Is the server name clear and unique?
- Is only the most useful server registered?
- Are credentials kept out of persisted settings?
- Are version and command choices intentional?
- Does the README state account, CLI, runtime, OAuth, and network requirements?
- Does an isolated install smoke test show the expected settings entry?
