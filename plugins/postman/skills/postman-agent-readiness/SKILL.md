---
name: postman-agent-readiness
description: Evaluate whether an API is ready for AI agents by reviewing OpenAPI specs, collections, docs, errors, auth, examples, and operational behavior. Use when the user asks whether an API is agent-ready or wants to improve agent usability.
---

# Postman Agent Readiness

Use this skill to review whether an API can be reliably discovered, understood, called, and recovered from by AI agents.

## Review Areas

Score and explain findings across these areas:

- Metadata: operation IDs, summaries, descriptions, tags, owners, and contact paths.
- Errors: consistent error schemas, machine-readable codes, retry guidance, and examples.
- Introspection: parameter types, required fields, enums, examples, request and response schemas.
- Naming: predictable casing, stable resource names, clear actions, and REST semantics.
- Predictability: pagination, filtering, sorting, idempotency, async operations, and date formats.
- Documentation: authentication, rate limits, environments, examples, and gotchas.
- Performance: batching, caching, timeouts, webhooks, and long-running operation guidance.
- Discoverability: OpenAPI version, server URLs, tags, collection organization, and docs links.

## Severity

- Critical: blocks agent usage entirely.
- High: causes frequent failed calls or unsafe actions.
- Medium: creates confusion or brittle integrations.
- Low: improves quality but does not block usage.

An API is agent-ready when there are no critical issues and the remaining issues are narrow enough that an agent can recover without human intervention.

## Workflow

1. Locate the local OpenAPI spec or Postman collection.
2. Read the relevant docs and examples.
3. Inspect auth and rate-limit guidance.
4. Review error responses and examples.
5. Produce a prioritized report with concrete fixes.
6. Ask before writing spec, collection, docs, or generated code changes.

## Output Shape

Return:

- Overall readiness judgment.
- Top blockers.
- High-value fixes.
- Optional Postman next steps, such as updating a spec, creating collection examples, adding tests, or generating docs.
