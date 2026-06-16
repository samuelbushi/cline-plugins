---
name: amplitude-session-replay
description: Analyze Amplitude Session Replay, UX friction, errors, bug reports, and reliability patterns. Use when the user asks to debug a user session, reproduce a bug, inspect friction, compare user journeys, or understand reliability regressions.
---

# Amplitude Session Replay

Use this skill when quantitative data is not enough and the user needs behavioral evidence from sessions.

## Replay Workflow

1. Identify the target: user, account, cohort, event, error, page, feature, conversion group, or replay URL.
2. Use Amplitude MCP to discover valid users, events, event properties, and replay filters. Do not guess event names.
3. Retrieve a bounded sample of sessions. Prefer recent, matching, high-signal sessions over large samples.
4. Decode replay events into a timeline: navigation, clicks, inputs, errors, rage clicks, dead clicks, retries, pauses, and abandonment.
5. Compare successful and unsuccessful journeys when the question is about conversion or UX friction.
6. Check deployment and experiment context when the issue is recent or segment-specific.
7. Summarize the reproducible sequence and evidence. Include replay links or IDs when safe.

## Reliability Workflow

- Query network failures, JavaScript errors, and error clicks when available.
- Group by page, route, browser, platform, version, country, account type, or plan.
- Estimate affected users and sessions before recommending urgency.
- Correlate spikes with deployments, experiments, and feedback.

## Output

For bug reports:

1. Reproduction path.
2. Most likely root cause.
3. Affected scope.
4. Replay evidence.
5. Recommended fix or next investigation.

For UX audits:

1. Ranked friction map.
2. Example behaviors.
3. Conversion or retention implication.
4. Design or instrumentation recommendation.

Protect privacy. Do not copy raw personal data from replays into files or commits.
