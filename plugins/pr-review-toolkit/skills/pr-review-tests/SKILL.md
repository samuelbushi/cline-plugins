---
name: pr-review-tests
description: Review whether changed behavior has useful tests, including missing edge cases, brittle tests, weak assertions, and overfitting to implementation details. Use when the user asks about test coverage or PR readiness.
---

# PR Review Tests

Review tests for behavior confidence, not coverage theater.

## Look For

- Changed behavior with no tests.
- Critical paths covered only by incidental tests.
- Edge cases that should fail without the fix.
- Tests that assert implementation details instead of user-visible behavior.
- Flaky timing, network, filesystem, or ordering assumptions.
- Missing negative cases and auth/error paths.
- Snapshot or fixture updates that hide real behavior changes.
- Tests that pass while important work is silently skipped.

## Triage

Rate each gap by shipping risk:

- Critical: likely production regression or data/security issue.
- High: important behavior can break without detection.
- Medium: meaningful edge case missing.
- Low: nice-to-have coverage or cleanup.

Suggest the smallest valuable test. Avoid asking for exhaustive matrices when one focused regression test would catch the bug.

## Output

List concrete gaps with:

- Changed behavior.
- Existing test coverage observed.
- Missing scenario.
- Suggested test shape.
- Risk if left untested.

If tests are adequate, say so and note any residual risk.
