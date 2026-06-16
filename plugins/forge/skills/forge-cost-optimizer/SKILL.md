---
name: forge-cost-optimizer
description: Reduce Atlassian Forge app platform consumption. Use for invocation count, duration, memory, storage, logs, scheduled triggers, product triggers, API calls, Custom UI versus resolver boundaries, and cost-aware architecture reviews.
---

# Forge Cost Optimizer

Use this skill when the user asks to reduce Forge cost, improve efficiency, or audit waste before release.

## Workflow

1. Read `manifest.yml`, package scripts, handlers, resolvers, triggers, and frontend bridge usage.
2. Identify cost drivers:
   - resolver and function invocations
   - duration and memory
   - storage reads and writes
   - log volume
   - scheduled and product trigger frequency
   - product API fanout
   - frontend-to-backend round trips
3. Separate measured issues from likely opportunities. Ask for metrics when needed.
4. Recommend small, behavior-preserving changes first.
5. Note security and freshness trade-offs for caching, batching, and denormalization.

## Common Opportunities

- Collapse multiple page-load `invoke()` calls into one resolver when data is needed together.
- Move static formatting or view-only transforms to the frontend.
- Add event filters, `ignoreSelf`, or narrower triggers.
- Batch product API calls where the API supports it.
- Cache stable reference data with clear invalidation.
- Reduce hot-path logging and avoid logging full payloads.
- Avoid storage writes when the value did not change.
- Right-size memory only after evidence shows it is too high or too low.

## Output

Return a prioritized optimization report with impact, evidence, recommended change, trade-offs, and validation steps. Do not change production behavior without user approval.
