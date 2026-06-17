---
name: logfire-ui
description: Open, build, or return Logfire project pages, live views, trace links, and Explore pages without querying telemetry first. Use this skill when the user asks to "open in Logfire", "show in the live view", "open Explore", "open the UI", "show in Cline", "use the browser", "give me a link", or asks for a Logfire GUI/browser/live-view presentation of a project, time range, service, span, trace, log, or filter. If "show" or "view" wording is ambiguous, ask whether the user wants a UI view or query analysis.
---

# Open Logfire UI

Use this skill for direct Logfire UI, browser, live-view, link, and Explore-page requests.

## User-Facing Progress

Keep progress updates quiet. Do not narrate why this skill was selected, restate routing rules, quote local instructions, explain token scope, or announce routine helper calls. If an update is needed, use one short sentence focused on the action, such as "Opening Logfire with the error filter."

After opening Logfire, do not run or narrate an extra page-state check unless the browser appears stuck, asks for login, or the user explicitly asked you to verify the page.

## Browser Targeting

If the user asks to open Logfire and the current Cline surface exposes an approved browser/navigation tool, use that tool. If no browser/navigation tool is available, return the clean Logfire URL instead of launching an external browser from the shell.

Do not use shell commands such as `open`, `xdg-open`, Playwright, Chrome DevTools, or a standalone browser unless the user explicitly asks for that external browser behavior. Do not start a local server or browser automation runtime just to display a Logfire link.

## Core Rule

For project-level or aggregate UI requests, open or return Logfire directly by URL.

Do not query telemetry first:
- Do not call `query_run`.
- Do not say you will query Logfire or fetch spans first.

Only query first when the user asks to open a specific unknown item that must be found first, such as "open the slowest trace" or "open the latest error trace".

If the request is ambiguous, such as "show recent errors" or "view logs", ask whether the user wants Logfire opened in the UI or a query analysis in chat. Do not do both unless the user explicitly asks for both.

## Project Discovery

For UI requests without an explicit organization/project, first try to resolve the canonical project URL through Logfire MCP auth/current-project metadata. Use a project-link or current-project helper if the available MCP server exposes one. This is project discovery, not telemetry querying.

If the MCP can resolve exactly one current project, use that project URL. If it cannot resolve a project, resolves multiple candidates, or returns an auth/error state, ask the user for the organization/project or full Logfire project URL.

Do not infer the project URL from `LOGFIRE_BASE_URL`, `LOGFIRE_URL`, exporter config, repository names, or localhost reachability. Env/config values can identify the Logfire platform/API base, but they do not by themselves identify the target organization/project.

## URL Workflow

1. If the full project URL is already known, use it directly.
2. If the user omits the project, resolve the current project through MCP as described above.
3. If the user gives a project name but not the organization/base URL, call `project_logfire_ui_link(project=project)` with the default clean-link behavior to derive the canonical project URL. This is a URL discovery helper, not a telemetry query.
4. For project live-view/filter URLs, call `project_logfire_ui_link(project=project, query=query, since=since, until=until, handoff=True)` only when opening the link immediately in a browser-capable Cline surface. Use the default clean-link behavior when returning a durable or shareable URL. If the user provides an existing clean Logfire project URL and asks for handoff, parse its project, `q`, `since`, and `until` values and pass them through this tool.
5. If the user gives or the query workflow has already found a real `trace_id`, call `project_logfire_link(trace_id=trace_id, project=project, handoff=True)` only when opening the link immediately in a browser-capable Cline surface. Use the default clean-link behavior when returning a durable or shareable URL.
6. Add `query`, `since`, and `until` through `project_logfire_ui_link` when useful. If manually assembling a clean URL, URL-encode `q`, `since`, and `until`.
7. If the user asked to open the URL and browser control is unavailable, return the clean URL rather than launching an external browser.

## Already-Open Live View Control

This section applies only when the current Cline surface exposes an approved browser/navigation tool with page interaction support and a Logfire project live view is already open. If that capability is not available, return or open a clean URL instead.

When page interaction support is available and the page exposes a supported Logfire command input, update that existing view rather than opening a new page. Fill the `Logfire live view agent command` input with a JSON patch such as `{"q":"level='error'","last":"1h","since":null,"until":null}` and submit it. Use direct URL/search-param updates only when the bridge form input is not present or cannot be submitted.

Do not mutate an `/api/auth/handoff?ticket=...` URL. Handoff URLs are single-use entry points only; after the redirect, control the final clean project URL.

Live view search parameters:

- `q`: SQL-like Logfire filter expression, for example `level='error'`, `kind='span'`, or `service_name='api'`. URL-encode this when constructing a URL string.
- `last`: rolling live window, such as `5m`, `1h`, `14d`, or a millisecond number. Use this for live mode and remove `since`/`until`.
- `since` and `until`: fixed historical window as ISO 8601 timestamps. Use these for a bounded time range and remove `last`.
- `env`: deployment environment filter. Use repeated `env` parameters for multiple environments. Omit it for all environments.
- `traceId` and `spanId`: focus a specific trace/span when known. Clear stale focus parameters such as `traceId`, `spanId`, `focusTraceId`, and `focusTraceTimestamp` when changing the main query or time range unless the user asked to preserve the focused record.

## Browser Handoff URLs

When the MCP link tools support `handoff: bool = False`, use `handoff=True` only for a URL that will be opened immediately in the browser. A handoff URL is short-lived, single-use, and bound to the destination minted by the platform.

- If the handoff result is a string, open that exact URL promptly. It may be an `/api/auth/handoff?ticket=...` URL. Do not add query params to it, rewrite it, persist it, quote it in docs, or treat it as shareable.
- If the handoff result is an object with `handoff: false`, use its `url` value as the clean fallback URL. Mention `reason` only when it helps the user understand why the browser may still ask for login, such as API-key auth or a need to re-authenticate.
- If the reason says to re-authenticate the Logfire MCP connection, explain that the MCP OAuth refresh token is missing the metadata needed to mint a UI session. Do not describe this as a browser-session refresh; the user needs to reconnect/re-authenticate the Logfire MCP auth flow.
- If the available MCP server does not expose `handoff`, call the link tool normally and use the clean URL.
- Do not manually append filters or time params to a handoff URL. Put the final project filter destination into `project_logfire_ui_link` and let the platform mint the ticket for that destination.

## Common Filters

- Spans: `q=kind%3D%27span%27`
- Logs: `q=kind%3D%27log%27`
- Exceptions: `q=is_exception%3Dtrue`
- Errors: `q=level%3D%27error%27`
- Service: URL-encode a filter such as `service_name='api'`

## Examples

For "open the Logfire live view for spans in starter-project for the last hour":

1. Open the known or derived `starter-project` Logfire URL directly.
2. Add `q=kind%3D%27span%27`.
3. Add `last=1h`.
4. Open the URL if browser control is available; otherwise return the clean URL.
5. Do not run SQL first.

For "find the slowest trace and open it", use the query workflow only to identify the trace, then use `project_logfire_link(trace_id=trace_id, project=project, handoff=True)` if opening immediately, or the default clean-link behavior if returning a durable URL.

For "change the open live view to the last hour of errors", submit `{"q":"level='error'","last":"1h","since":null,"until":null}` through the `Logfire live view agent command` input only when page interaction support and that control are available; otherwise return or open the equivalent clean URL. Do not mint a new handoff URL just to change an already-open view.

## Auth Boundary

Do not try to pass MCP auth tokens into the browser or Logfire UI. Never put bearer, API, read, write, or MCP auth tokens in URL query parameters, fragments, pasted browser instructions, logs, or notes. MCP/tool authentication and browser web sessions are separate security contexts.

For immediately opened UI links, prefer the platform handoff described above. If handoff is unavailable, fall back to the clean URL and explain the specific fallback reason when useful. A missing browser cookie may require normal browser login; a stale MCP OAuth connection requires MCP re-authentication instead.
