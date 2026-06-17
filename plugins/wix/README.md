# Wix

Wix adds platform guidance for building and managing Wix sites, apps, dashboard extensions, CMS-backed experiences, eCommerce flows, and headless Wix frontends.

## Install

```bash
cline plugin install wix
```

For local development:

```bash
cline plugin install ./plugins/wix --cwd .
```

After installation, ask Cline:

```text
Help me add a dashboard page to this Wix CLI app.
```

or:

```text
Connect this existing frontend to Wix Headless.
```

## Cline Primitives

- MCP: registers `wix-mcp`, a Streamable HTTP MCP server at `https://mcp.wix.com/mcp` for Wix platform operations such as site management, CMS, eCommerce, and dashboard-extension workflows.
- Skills: bundles Wix app development, Wix Design System, Wix site/business management, and Wix headless development skills with their supporting references and helper scripts.
- Rule: adds a Wix safety rule that treats live sites, app releases, business data, payments, domains, media, and marketplace submissions as sensitive production surfaces.

## Requirements

The remote MCP server may require Wix account authorization before tools are usable. CLI-oriented workflows require the Wix CLI and project dependencies in the user's workspace when those workflows are requested.

The plugin does not install the Wix CLI, create projects, authenticate, deploy, publish, mutate site data, or submit app changes during installation. Those operations should happen only after an explicit user request in the active Cline session.

## Security

Wix account tokens, API keys, site IDs, app IDs, customer data, orders, bookings, payments, domains, media, and CMS content should be treated as sensitive. The bundled skills prefer local inspection and planned diffs before live Wix CLI, REST, MCP, build, release, or deploy operations.
