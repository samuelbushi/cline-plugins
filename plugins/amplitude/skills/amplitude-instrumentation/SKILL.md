---
name: amplitude-instrumentation
description: Plan Amplitude analytics instrumentation for a feature, PR, branch, file, directory, or codebase area. Use when the user asks to add tracking, instrument a flow, review analytics coverage, or decide which Amplitude events and properties should be added.
---

# Amplitude Instrumentation

Use this skill to produce a concrete tracking plan, not to blindly add event calls. The output should help an engineer implement useful, governed Amplitude instrumentation.

## Workflow

1. Identify the target: PR, branch, file, directory, or feature description. Use existing conversation context before asking.
2. Read the relevant code or diff. Focus on user-facing behavior, states, transitions, errors, and business outcomes.
3. Discover existing analytics patterns in the codebase. Search for calls such as `track`, `trackEvent`, `logEvent`, `amplitude.track`, `analytics.track`, `ampli`, and project-specific wrappers.
4. Discover existing Amplitude taxonomy when MCP access is available. Look for related events, properties, naming conventions, and duplicates before proposing new names.
5. Propose events only where they support a decision. Prioritize conversion, activation, retention, reliability, monetization, and meaningful user intent.
6. Produce an implementation plan with exact files, handlers, events, properties, trigger conditions, and verification steps.

## Event Design

- Prefer event names that match the existing taxonomy style.
- Include only properties that are stable, queryable, and useful for segmentation.
- Separate user intent from system outcome when both matter, for example started, completed, failed.
- Include error, empty-state, cancellation, and retry events when they explain user friction.
- Avoid high-cardinality properties such as raw text, full URLs with IDs, emails, names, tokens, and arbitrary JSON.
- Do not recommend sampling. Sampling breaks funnels, journeys, cohorts, destinations, and governance.

## Output Format

Return:

1. Coverage summary: what the current code already tracks and what is missing.
2. Priority table: event name, priority, trigger, properties, source file, and rationale.
3. Implementation notes: wrapper or SDK call to use, code locations, and edge cases.
4. Verification plan: how to test locally, in Amplitude debug tools, and after release.
5. Open questions: only the questions that block safe instrumentation.

Ask before editing code. If the user asks for implementation, apply the plan using the repository's existing analytics wrapper and tests.
