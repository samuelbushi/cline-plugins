---
name: pr-review-types
description: Review type design, data modeling, invariants, API shapes, state machines, and TypeScript or typed-language boundaries. Use when new types, schemas, models, discriminated unions, or public interfaces changed.
---

# PR Review Types

Review whether types express real invariants and make invalid states harder to represent.

## Review For

- Overly broad strings, numbers, maps, or optional fields where a narrower type would prevent bugs.
- Booleans that should be a state enum or discriminated union.
- Invariants enforced only by comments or call-site convention.
- Public types that leak implementation details.
- Types that are too clever for the problem.
- Unsafe casts, `any`, untyped JSON boundaries, and unchecked schema parsing.
- Mismatches between runtime validation and static types.
- Backward compatibility risk in exported interfaces.

## Scoring

When useful, rate:

- Encapsulation.
- Invariant expression.
- Usefulness to callers.
- Runtime enforcement.

Use a 1-10 scale only when it clarifies the review. Otherwise provide direct findings.

## Output

For each issue include the invalid state or misuse the current type allows, why that matters, and the smallest better shape.
