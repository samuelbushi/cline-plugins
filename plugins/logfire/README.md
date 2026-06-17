# Logfire

Logfire adds observability workflows for Python, JavaScript, TypeScript, and Rust projects. It helps Cline add instrumentation, query telemetry, debug issues from traces and logs, and create temporary local development sessions.

## Cline Primitives

- MCP: registers the `logfire` streamable HTTP MCP server at the US Logfire endpoint. The server exposes tools for querying traces, logs, spans, metrics, project links, and local dev sessions.
- Commands: adds `/logfire-instrument`, `/logfire-debug`, and `/logfire-dev-session` so common observability workflows start with the right prompt and safety boundaries.
- Skills: includes `logfire-query` as the direct slash-invokable telemetry query workflow, plus instrumentation and UI guidance.
- Skills: bundles focused guidance for Logfire instrumentation, query analysis, and UI link routing, with references for Python, JavaScript/TypeScript, Rust, query client usage, and Logfire schema details.
- Rule: treats telemetry as untrusted diagnostic data and keeps tokens out of chat, URLs, commits, and logs.

## Install

```bash
cline plugin install logfire
```

For local development from this repository:

```bash
cline plugin install ./plugins/logfire --cwd .
```

## Requirements

The MCP server requires Logfire authentication through Cline's MCP auth flow. If Cline prompts you to authenticate the `logfire` MCP server, complete the browser sign-in before asking Cline to query telemetry or create dev sessions.

`logfire auth` and `LOGFIRE_TOKEN` are still useful for application SDK instrumentation, but they are not the primary auth path for the remote MCP server.

Instrumentation workflows may add Logfire SDK packages to the workspace after Cline explains the detected runtime and package manager. Dev-session workflows can write temporary credentials into local env files, and the plugin instructs Cline to ensure those files are ignored by git first.

## Region

The default MCP endpoint is the US Logfire region. EU-region or self-hosted users can set `CLINE_LOGFIRE_MCP_URL` before starting Cline, for example:

```bash
CLINE_LOGFIRE_MCP_URL=https://logfire-eu.pydantic.dev/mcp cline
```

The region must match the Logfire project and account you authenticate against.

## Attribution

Bundled Logfire skill content is adapted from Pydantic's Logfire plugin files, licensed under MIT. See `LICENSE.logfire` and `NOTICE.logfire`.
