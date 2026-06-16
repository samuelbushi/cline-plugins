---
name: amplitude-taxonomy
description: Audit, design, and improve Amplitude event taxonomy, event names, properties, groups, governance, and tracking plans. Use when the user asks about analytics taxonomy, duplicate events, event volume, schema limits, naming conventions, or tracking quality.
---

# Amplitude Taxonomy

Use this skill for Amplitude data quality, governance, and event design.

## Workflow

1. Clarify the problem: event volume, taxonomy type count, naming drift, duplicate events, missing events, property quality, governance, or a new tracking plan.
2. Discover current taxonomy through Amplitude MCP when available and through codebase analytics patterns when working on implementation.
3. Separate volume problems from type-count problems. They have different fixes.
4. Score findings by user impact, analysis impact, cost or limit risk, implementation risk, and confidence.
5. Ask one focused clarification question when semantic intent is ambiguous.
6. Recommend metadata-only fixes first where possible. Treat deletion, blocking, and merge changes as higher-risk and ask for confirmation.

## Key Rules

- Blocking and hiding events do not reduce distinct taxonomy type count.
- Deleting event or property types can reduce type count but can break analysis. Confirm before recommending destructive actions.
- Blocking events can reduce event volume but preserves type count.
- Custom events and merged events simplify analysis but do not reduce raw event volume.
- Never recommend sampling as a default cost-control move. Sampling can break funnels, journeys, cohorts, destinations, and downstream analysis.
- High-cardinality properties are usually a governance smell unless they are intentionally used as identifiers.
- A zero-query count is a review signal, not proof that an event is useless.

## Output

Return a prioritized audit with:

- Finding and severity.
- Evidence from Amplitude or code.
- Impact on analysis, cost, limits, or implementation.
- Recommended action.
- Risk and rollback notes.

When designing new taxonomy, include event name, trigger, properties, property types, owner, description, examples, and validation plan.
