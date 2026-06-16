---
name: amplitude-feedback
description: Synthesize customer feedback in Amplitude and connect themes to behavioral data. Use when the user asks what customers are saying, wants feature requests or complaints summarized, or needs feedback evidence for a product decision.
---

# Amplitude Feedback

Use this skill to turn customer feedback into actionable themes and connect those themes to product behavior.

## Workflow

1. Identify the scope: product area, feature, account segment, plan, customer type, geography, date range, or launch.
2. Discover available feedback sources through Amplitude MCP before querying.
3. Pull feedback insights for the scoped time range and theme.
4. Retrieve representative mentions for the top insights. Use quotes sparingly and only when they clarify the theme.
5. Cross-check with behavior when possible: affected cohorts, funnels, dashboards, session replays, error data, experiments, or account health.
6. Group feedback into themes such as requests, bugs, pain points, praise, confusion, pricing, onboarding, reliability, or missing capability.
7. Rank themes by frequency, severity, affected segment, business impact, and confidence.

## Output

Return:

- Executive takeaway: one paragraph.
- Theme table: theme, evidence, affected users or accounts, behavior signal, severity, confidence, and next action.
- Representative examples: short, anonymized snippets or summaries where useful.
- Product recommendations: prioritized and tied to evidence.

## Guardrails

- Do not overfit to a single loud customer.
- Preserve privacy. Avoid exposing raw names, emails, or account identifiers unless the user asked for account-specific work.
- Distinguish feedback frequency from revenue or strategic importance.
- If feedback sources are missing or sparse, say so and recommend instrumentation or survey changes.
