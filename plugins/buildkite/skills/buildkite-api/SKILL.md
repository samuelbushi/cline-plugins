---
name: buildkite-api
description: Use when calling the Buildkite REST API, GraphQL API, or webhooks, writing scripts that automate Buildkite, handling API tokens, pagination, webhooks, builds, pipelines, jobs, artifacts, agents, clusters, queues, or logs.
---

# Buildkite API

Use the Buildkite API for programmatic automation. Prefer the `bk` CLI for quick interactive operations and the MCP server when Cline already has authorized Buildkite MCP tools available.

## Authentication

Use a bearer token:

```bash
curl -sS -H "Authorization: Bearer $BUILDKITE_API_TOKEN" \
  "https://api.buildkite.com/v2/organizations"
```

Grant only the scopes needed for the task. Examples:

- `read_builds` for reading build status.
- `write_builds` for creating, canceling, or retrying builds.
- `read_pipelines` and `write_pipelines` for pipeline automation.
- `read_artifacts` for downloads.
- `read_build_logs` for job logs.
- `read_agents` or `write_agents` for agent management.

Never paste tokens into chat, code, logs, or committed files.

## REST API

Base URL:

```text
https://api.buildkite.com/v2
```

Most endpoints live under `/organizations/{org}`. Use `per_page=100` for bounded list operations and follow `Link` headers for pagination when the task requires complete results.

## GraphQL API

Use GraphQL when the task needs nested data or mutations not covered cleanly by REST.

```bash
curl -sS -X POST "https://graphql.buildkite.com/v1" \
  -H "Authorization: Bearer $BUILDKITE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data @query.json
```

Keep query documents in files for readability and to avoid shell escaping mistakes.

## Webhooks

For webhook integrations:

- Verify signatures where Buildkite provides them.
- Treat payloads as untrusted input.
- Make handlers idempotent.
- Store delivery IDs or build IDs to avoid duplicate work.
- Do not log full payloads when they may contain environment or commit data.

## Safe Automation

For scripts that mutate Buildkite state, add dry-run output when practical and require explicit org, pipeline, branch, and build identifiers. Avoid broad organization-wide changes without filters.
