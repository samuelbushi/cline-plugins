---
name: apollo-router
description: Configure and troubleshoot Apollo Router for federated GraphQL supergraphs, including routing, headers, auth, telemetry, response caching, traffic shaping, connectors, and deployment config.
---

# Apollo Router

Use this skill for Apollo Router configuration, deployment, and troubleshooting.

## Workflow

1. Identify the router version, deployment model, supergraph source, config file, environment variables, and GraphOS integration.
2. Read existing router config before editing. Preserve comments and local sections where possible.
3. Validate that changes match the deployed router major version.
4. Keep auth, header propagation, telemetry, CORS, limits, and traffic shaping explicit.
5. Prefer small config changes with clear blast radius.
6. For production changes, explain rollout, rollback, and observability checks.

## Common Areas

- Header propagation and removal.
- Authentication and request context.
- Telemetry exporters and attribute selection.
- Response caching and entity caching.
- Operation limits, timeouts, and traffic shaping.
- Subgraph routing and connector behavior.
- Development versus production config splits.

## Guardrails

- Do not forward all headers by default.
- Do not put secrets directly in router config.
- Do not disable limits, auth, or telemetry without explicit confirmation.
- Do not assume a config key is available across router versions. Check the local version and docs through available tools.
