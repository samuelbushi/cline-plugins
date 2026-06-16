---
name: posthog-error-tracking
description: This skill should be used when the user asks to instrument, triage, group, suppress, assign, or investigate PostHog error tracking issues, stack traces, source maps, fingerprints, alerts, or noisy errors.
---

# PostHog Error Tracking

Use this skill for PostHog error tracking setup and investigations.

## Instrumentation

Detect the runtime and framework before adding SDK code. Keep project keys in environment variables or the existing secret system. Configure release/version tagging when the app has deploy metadata.

For source maps, confirm the build output path, upload timing, release identifier, and whether maps contain source content.

## Investigation

Start with issue frequency, affected users, first seen, last seen, release, route, browser/runtime, stack trace, and linked session replays. Compare with recent code changes.

Group noisy errors only after checking whether different root causes share one fingerprint. Suppress only when the user confirms the noise is expected.

## Alerts

Set alerts on actionable signals: new issue, regression, affected user threshold, or volume change. Avoid alerting on broad noisy groups without ownership.

## Output

Lead with user impact, likely root cause, evidence, fix path, and monitoring follow-up.
