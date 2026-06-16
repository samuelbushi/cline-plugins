---
name: qodo-rules
description: "Use when the user wants Qodo coding rules or organization-specific review standards applied to a coding, refactoring, or review task."
---

# Qodo Rules

Use this skill to load task-relevant Qodo coding rules when the user has Qodo configured and wants organization-specific standards included in the work.

## Guardrails

- Do not call Qodo automatically. Ask before making the external request unless the user directly asked to load Qodo rules in this turn.
- Do not print API keys, bearer tokens, or full credential files.
- Do not write Qodo credentials to the workspace.
- If rules are already present in the conversation, reuse them instead of fetching again.
- Treat returned rules as guidance to apply alongside repository conventions, not as a reason to override explicit user instructions.

## Configuration

Qodo rules lookup needs an API key from one of these sources:

- `QODO_API_KEY` environment variable.
- `~/.qodo/config.json` with `API_KEY`.

Optional endpoint selection:

- `QODO_API_URL` environment variable or `QODO_API_URL` in `~/.qodo/config.json` for a custom Qodo base URL.
- `QODO_ENVIRONMENT_NAME` or `ENVIRONMENT_NAME` in `~/.qodo/config.json` for non-production Qodo environments.

API URL resolution:

1. If `QODO_API_URL` is configured, use it as the base URL. Append `/rules/v1` if the value does not already include that path.
2. Else if an environment name is configured, use `https://qodo-platform.<ENVIRONMENT_NAME>.qodo.ai/rules/v1`.
3. Else use the production default `https://qodo-platform.qodo.ai/rules/v1`.

If configuration is missing, explain what is needed and continue without Qodo rules.

## Workflow

1. Confirm the user wants live Qodo rule lookup.
2. Identify the current coding assignment and repository context.
3. Build two structured search queries:
   - Topic query for the primary change.
   - Cross-cutting query for standards that apply broadly, such as architecture, logging, testability, security, and maintainability.
4. If the workspace is a git repository with an `origin` remote, derive a repository scope such as `/org/repo/`. If the remote cannot be parsed, omit scope instead of failing.
5. Call the Qodo rules search endpoint once per query, merge results by rule ID, and preserve topic-query order before cross-cutting rules.
6. Present the loaded rules grouped by severity and explain how they apply to the current task.

## Query Format

Use this shape for each semantic query:

```text
Name: Short rule title this task should trigger
Category: Architecture | Security | Reliability | Performance | Quality | Testability | Compliance | Accessibility | Observability | Correctness
Content: One or two concrete sentences describing what should be checked or enforced for this task and tech stack.
```

Prefer a specific category over `Correctness` when the task is really about architecture, security, reliability, performance, testability, accessibility, observability, or compliance.

## External Request Shape

Use the configured Qodo API base URL and call:

```text
POST {API_URL}/rules/search
Authorization: Bearer {API_KEY}
Content-Type: application/json
request-id: {UUID}
qodo-client-type: skill-qodo-rules
```

Body:

```json
{
  "query": "<structured query>",
  "top_k": 20,
  "scopes": ["/org/repo/"]
}
```

Omit `scopes` entirely when no repository scope is available.
