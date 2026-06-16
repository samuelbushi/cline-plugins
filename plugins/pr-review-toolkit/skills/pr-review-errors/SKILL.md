---
name: pr-review-errors
description: Review error handling for silent failures, swallowed exceptions, unsafe fallbacks, weak logging, and incorrect recovery behavior. Use when catch blocks, fallback paths, retries, auth failures, or external integrations changed.
---

# PR Review Errors

Hunt for errors that disappear, become misleading, or trigger unsafe fallback behavior.

## Review For

- Empty or generic catch blocks.
- Logging without propagation when callers need to know failure happened.
- Returning defaults that hide data loss or partial failure.
- Treating auth, permission, rate-limit, network, and validation errors the same way.
- Retrying non-idempotent operations.
- Fallback to mock, fake, or stale data outside tests.
- Error messages that lack action, context, or identifiers.
- Promise chains, async callbacks, or event handlers where errors can be dropped.
- Cleanup paths that mask the original failure.

## Output

For each issue include:

- The hidden or misclassified failure.
- Why a user or operator would miss it.
- Whether it should be logged, surfaced, retried, wrapped, or propagated.
- A concrete fix direction.

Prefer fewer high-confidence findings over a long list of hypothetical failures.
