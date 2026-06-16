# PostHog

PostHog adds the official PostHog MCP server plus a full PostHog skill pack for product analytics, feature flags, experiments, session replay, error tracking, LLM analytics, warehouse data, endpoints, Signals, surveys, and instrumentation.

## Cline Primitives

- MCP server: registers the PostHog streamable HTTP MCP endpoint with PostHog's plugin consumer header. It exposes PostHog tools for analytics, insights, dashboards, feature flags, experiments, surveys, error tracking, replays, warehouse data, endpoints, Signals, LLM analytics, and docs. Authentication is handled through Cline's MCP auth flow.
- Slash command: `/posthog` starts a structured workflow for PostHog audits, instrumentation, investigations, cleanup, or reporting.
- Skills: bundles the PostHog workflow skill pack: 81 detailed PostHog skills plus Cline-specific MCP setup guidance. The skills cover HogQL querying, metric investigations, web analytics, heatmaps, autocapture, SDK health, flags, experiments, replay analysis, Replay Vision, error tracking, logs/APM, warehouse sync, endpoints, LLM analytics, Signals scouts, surveys, user interviews, subscriptions, and visual review.
- Rule: adds safety guidance for write-capable PostHog operations and sensitive customer data.

## Requirements

Use the default PostHog Cloud MCP endpoint, or set `POSTHOG_MCP_URL` before installing for a self-hosted PostHog MCP endpoint:

```bash
export POSTHOG_MCP_URL="https://mcp.your-posthog-instance.com/mcp"
```

The URL must use HTTPS. If `POSTHOG_MCP_URL` is invalid, the plugin skips MCP registration while keeping its command, rule, and skills available with setup guidance. The plugin does not persist API keys or tokens. OAuth and account access happen through the PostHog MCP connection.

## Trust Boundaries

PostHog data can include customer identifiers, event properties, survey responses, logs, replays, and error details. The plugin asks Cline to prefer read-only discovery, confirm write operations, avoid printing secrets, and summarize or redact personal data unless the user explicitly needs a narrow excerpt for debugging.

This plugin does not enable automatic Cline session telemetry or install session-ingest hooks. LLM analytics guidance is for instrumenting user applications or explicitly querying PostHog data through MCP.
