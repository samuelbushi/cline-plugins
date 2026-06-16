---
name: posthog-session-replay
description: This skill should be used when the user asks to investigate PostHog session replay, find recordings for an issue, diagnose missing recordings, inspect heatmaps, debug rage clicks, create replay scanners, or compare replay behavior across variants.
---

# PostHog Session Replay

Use this skill to connect user behavior evidence to product or code issues.

## Finding Replays

Clarify the user, route, time window, release, experiment variant, feature flag, browser, or error being investigated. Use the narrowest query that can find relevant sessions.

Avoid exporting or pasting raw recordings or personal data. Summarize observed behavior and redact identifiers unless required for debugging.

## Missing Recordings

Check SDK installation, project settings, sampling, URL privacy rules, consent gates, ad blockers, cross-origin isolation, network failures, and whether the user actually triggered captured events.

## Heatmaps And Interaction Patterns

For heatmaps, distinguish clicks, rage clicks, dead clicks, scroll depth, and form behavior. Tie observations to concrete UI elements and code paths when possible.

## Output

Return the observed behavior, likely cause, confidence, and next action. Separate replay evidence from analytics aggregates and code hypotheses.
