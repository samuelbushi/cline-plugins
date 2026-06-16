---
name: logfire-ui
description: Build or return Logfire project, live view, Explore, and trace links without querying telemetry first. Use when the user asks to open Logfire, get a link, view a live page, or use the Logfire UI instead of chat analysis.
---

# Logfire UI Links

Use this skill when the user wants a Logfire UI page or link.

Do not query telemetry first for project-level UI requests. Only query first when the user asks to open a specific unknown item that must be found, such as the slowest trace or latest error trace.

## Routing

- Query analysis: use `logfire-query`.
- Direct project, live view, Explore, browser, or link request: use this skill.
- Ambiguous "show recent errors" or "view logs": ask whether the user wants chat analysis or a Logfire UI view.
- Combined request: perform only the requested analysis, then provide the relevant link.

## Project Discovery

If the user provides a full Logfire URL, use it directly.

If they provide only a project name, prefer Logfire MCP link tools when available to derive the canonical project URL.

If no project can be resolved, ask for the organization/project or a full Logfire project URL. Do not infer a project URL from environment variables such as `LOGFIRE_BASE_URL`, `LOGFIRE_URL`, or exporter endpoints. Those identify the platform or API base, not the user project.

## Common Filters

Use URL-encoded filters when constructing links:

- Errors: `level='error'`
- Exceptions: `is_exception=true`
- Spans: `kind='span'`
- Logs: `kind='log'`
- Service: `service_name='api'`

Use a rolling live window such as `last=1h`, or fixed `since` and `until` ISO timestamps for a bounded historical window.

## Auth Boundary

Never put Logfire tokens, MCP auth tokens, read tokens, or bearer tokens in URLs. MCP authentication and browser login are separate security contexts. If a link requires login, tell the user to authenticate normally in Logfire.

When MCP tools can mint Logfire UI links, prefer clean shareable URLs unless the user explicitly asks to open the link immediately in a browser-capable Cline surface.
