---
name: pr-review-simplify
description: Review recently changed code for unnecessary complexity, confusing abstractions, over-nesting, duplication, and readability issues while preserving behavior. Use after correctness review passes or when the user asks to simplify code.
---

# PR Review Simplify

Use this after correctness risks are handled. The goal is clearer code with the same behavior.

## Look For

- Deep nesting that can be flattened.
- Abstractions with only one weak use.
- Duplicated logic that is likely to drift.
- Clever expressions that obscure intent.
- Overly compact code that makes edge cases hard to see.
- Helper names that hide side effects or scope.
- Comments compensating for unclear code.
- Refactors that would touch too much for the benefit.

## Guidance

Suggest small, behavior-preserving improvements. Do not demand refactors that create churn or broaden the diff without clear benefit. Respect existing project patterns.

## Output

For each simplification include:

- Current complexity.
- Simpler shape.
- Why it preserves behavior.
- Whether it is worth doing before merge or can wait.

If the code is already clear enough, say so.
