---
name: posthog-signals-scouts
description: This skill should be used when the user asks about PostHog Signals, scouts, anomaly detection, observability gaps, web analytics scouts, revenue analytics scouts, CSP violations, data pipeline scouts, or automated product monitoring.
---

# PostHog Signals And Scouts

Use this skill for PostHog Signals and scout-style monitoring workflows.

## Design A Scout

Clarify the signal, owner, actionability, cadence, data source, and expected output. A useful scout should produce a decision or escalation, not just more noise.

Define:

- Query or event source
- Threshold or anomaly logic
- Deduplication and cooldown
- Severity and owner
- Required context in emitted signals
- False-positive handling

## Review A Scout Fleet

Check coverage gaps, duplicate scouts, stale owners, noisy thresholds, low-volume signals, missing runbooks, and alerts without clear actions.

## Output

For new scouts, propose the smallest viable monitor and a test plan. For existing scouts, report health, noise, missing context, and recommended tuning.
