---
name: posthog-product-analytics
description: This skill should be used when the user asks about PostHog product analytics, events, HogQL, funnels, cohorts, retention, dashboards, insights, heatmaps, live traffic, metrics, or event taxonomy quality.
---

# PostHog Product Analytics

Use this skill to answer analytics questions or improve event quality with PostHog.

## Discovery

Clarify the time window, environment, user segment, event names, conversion goal, and whether the user wants a one-time answer or durable dashboard.

Use PostHog MCP to inspect available events, properties, cohorts, insights, dashboards, and docs. Do not invent event names or property keys.

## Querying

Prefer existing insights and dashboards before writing new queries. When writing HogQL or filters:

- Validate event and property names first.
- Keep time ranges bounded.
- Aggregate before exposing raw users.
- Explain assumptions around identity, groups, bot traffic, timezone, and sampling.

## Quality Review

Check for duplicate events, inconsistent casing, missing identity calls, unstable property types, high-cardinality properties, noisy autocapture, and dashboard metrics that lack ownership.

## Output

Report the answer, evidence, caveats, and recommended next action. For audits, group findings by blocker, quick win, and follow-up investigation.
