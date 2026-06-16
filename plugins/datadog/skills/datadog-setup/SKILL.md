---
name: datadog-setup
description: Configure or troubleshoot Cline's Datadog MCP connection. Use when the user wants to connect Datadog, pick a Datadog site, change MCP domains, authorize OAuth, choose toolsets, or diagnose why Datadog tools are unavailable.
---

# Datadog Setup

Use this skill when the user needs Datadog MCP setup, authentication, site selection, or toolset guidance.

## Site And Domain Mapping

Use this table when the user knows their Datadog site:

| Site | MCP domain            |
| ---- | --------------------- |
| us1  | mcp.datadoghq.com     |
| us3  | mcp.us3.datadoghq.com |
| us5  | mcp.us5.datadoghq.com |
| eu   | mcp.datadoghq.eu      |
| ap1  | mcp.ap1.datadoghq.com |
| ap2  | mcp.ap2.datadoghq.com |

If the user gives an app URL, infer the site from the host. `app.datadoghq.com` is us1, `us3.datadoghq.com` is us3, `us5.datadoghq.com` is us5, `app.datadoghq.eu` is eu, `ap1.datadoghq.com` is ap1, and `ap2.datadoghq.com` is ap2.

## Cline Setup Flow

1. Check whether the `datadog` MCP server is already configured and authorized in Cline.
2. If the server is present but unauthorized, instruct the user to authorize it through Cline's MCP configuration UI.
3. If the user needs a non-US1 site, tell them to set `DD_SITE` or `DD_MCP_DOMAIN` before installing or re-enabling the plugin so the plugin writes the correct MCP URL.
4. If the user needs a restricted toolset list, tell them to set `DD_MCP_TOOLSETS` before installing or re-enabling the plugin.
5. After changing environment variables, tell the user to reinstall or re-enable the plugin so the plugin-owned MCP settings are regenerated.

## Environment Variables

- `DD_SITE`: one of `us1`, `us3`, `us5`, `eu`, `ap1`, `ap2`, or a Datadog site host such as `datadoghq.com`, `datadoghq.eu`, or `us3.datadoghq.com`.
- `DD_MCP_DOMAIN`: exact MCP domain. This overrides `DD_SITE`. Do not include `https://` or a path.
- `DD_MCP_TOOLSETS`: comma-separated toolset list. Leave unset to use Datadog server defaults.

Do not ask users to paste OAuth tokens into chat. Do not print API keys, application keys, or auth headers.

## Static Key Authentication

This curated plugin is OAuth-oriented and does not write `DD_API_KEY` or `DD_APPLICATION_KEY` into MCP headers. If the user explicitly needs static key authentication, guide them to create a user-managed Datadog MCP server with their chosen headers and explain that those credentials will live in their MCP settings.

## Troubleshooting

- Wrong site or domain: compare the user's Datadog app URL to the site table and update `DD_SITE` or `DD_MCP_DOMAIN`.
- OAuth expired or incomplete: ask the user to reauthorize the `datadog` MCP server in Cline.
- Tools missing after env changes: reinstall or re-enable the plugin so plugin-owned MCP settings are regenerated.
- Network or permissions issue: verify the user's network can reach the selected MCP domain and that their Datadog account has MCP access.
