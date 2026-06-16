---
name: posthog-instrumentation
description: This skill should be used when the user asks to install or review PostHog SDK instrumentation for web, mobile, backend, product analytics, feature flags, error tracking, logs, session replay, identify, groups, or environment configuration.
---

# PostHog Instrumentation

Use this skill to add or review PostHog SDK code.

## Inspect First

Detect framework, runtime, package manager, existing analytics code, environment variable patterns, consent requirements, routing, and server/client boundaries.

Do not paste project keys into code. Use environment variables or the repository's existing secret/config system.

## Event Design

Before editing, define:

- Event names and ownership
- Required properties
- Identity and group strategy
- Server-side versus client-side capture
- Feature flag checks and fallback behavior
- Replay, autocapture, and privacy boundaries
- Error and log capture scope

## Implementation

Follow existing code style and test patterns. Keep SDK initialization in one clear place. Avoid enabling high-volume capture by default.

## Verification

Add a practical verification path: local smoke event, test mode, debug logging, or PostHog live events. Avoid sending production events from tests.
