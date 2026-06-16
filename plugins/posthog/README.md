# PostHog

PostHog adds the official PostHog MCP server plus focused workflow guidance for product analytics, feature flags, experiments, session replay, error tracking, LLM analytics, warehouse data, surveys, and instrumentation.

## Cline Primitives

- MCP server: registers the PostHog streamable HTTP MCP endpoint. It exposes PostHog tools for analytics, insights, dashboards, feature flags, experiments, surveys, error tracking, replays, warehouse data, and docs. Authentication is handled through Cline's MCP auth flow.
- Slash command: `/posthog` starts a structured workflow for PostHog audits, instrumentation, investigations, cleanup, or reporting.
- Skills: bundled skills give Cline compact guidance for MCP usage, product analytics, flags and experiments, replays, errors, warehouse data, LLM analytics, SDK instrumentation, surveys, and Signals scouts.
- Rule: adds safety guidance for write-capable PostHog operations and sensitive customer data.

## Requirements

Use the default PostHog Cloud MCP endpoint, or set `POSTHOG_MCP_URL` before installing for a self-hosted PostHog MCP endpoint:

```bash
export POSTHOG_MCP_URL="https://mcp.your-posthog-instance.com/mcp"
```

The URL must use HTTPS. If `POSTHOG_MCP_URL` is invalid, the plugin skips MCP registration while keeping its command, rule, and skills available with setup guidance. The plugin does not persist API keys or tokens. OAuth and account access happen through the PostHog MCP connection.

## Trust Boundaries

PostHog data can include customer identifiers, event properties, survey responses, logs, replays, and error details. The plugin asks Cline to prefer read-only discovery, confirm write operations, avoid printing secrets, and summarize or redact personal data unless the user explicitly needs a narrow excerpt for debugging.

This plugin does not enable automatic Cline session telemetry. LLM analytics guidance is for instrumenting user applications or explicitly querying PostHog data through MCP.
