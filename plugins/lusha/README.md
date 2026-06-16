# lusha

Adds Lusha B2B prospecting, enrichment, and buying-signal workflows to Cline.

## What It Does

The plugin registers the `lusha` remote MCP server. Lusha provides tools for contact lookup, prospecting search, company search, buying signals, account usage, enrichment, and lookalike discovery.

In Cline, Lusha MCP tools are exposed with the `lusha__` prefix, such as `lusha__contacts_search` and `lusha__prospecting_contact_enrich`.

It also bundles four Cline skills:

- `lusha-enrich-contact` for single-contact lookup and enrichment.
- `lusha-prospect` for ICP-based lead-list building.
- `lusha-signal-prospect` for trigger-based prospecting from company or contact signals.
- `lusha-lookalike-prospect` for expansion from reference companies or contacts.

A prompt rule reminds Cline to treat contact reveals and large enrichment batches as credit-consuming operations that need clear user intent.

## Install

```bash
cline plugin install lusha
```

For local development from this repository:

```bash
cline plugin install ./plugins/lusha --cwd .
```

## Requirements

- A Lusha account with access to the MCP server.
- OAuth sign-in when Cline first authorizes the `lusha` MCP server.
- Available Lusha credits for phone and email reveal operations.
- Lusha currently exposes a Claude-compatible MCP endpoint for this OAuth flow. The plugin uses that endpoint and client header until Lusha publishes a Cline-specific MCP endpoint.

## Security Notes

Lusha returns business contact data. Do not export, persist, or re-share contacts unless the user asks for that workflow. The plugin does not store API keys or static tokens; authentication is handled by the MCP OAuth flow.
