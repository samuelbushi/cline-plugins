---
name: posthog-feature-flags-experiments
description: This skill should be used when the user asks to create, audit, clean up, copy, roll out, pause, ship, or diagnose PostHog feature flags, experiments, A/B tests, variants, exposure events, experiment metrics, or stale flags.
---

# PostHog Feature Flags And Experiments

Use this skill for flag and experiment workflows.

## Feature Flags

Before changing a flag, inspect its key, rollout rules, variants, dependencies, usage in code, and recent evaluation volume. Confirm writes before creating, deleting, archiving, restoring, or changing rollout.

For stale flag cleanup:

- Check whether the flag is fully rolled out, unused, abandoned, or still referenced in code.
- Find code references before recommending deletion.
- Prefer a staged cleanup plan: ship code path, remove checks, archive flag.

## Experiments

Before creating or editing an experiment, define:

- Hypothesis
- Target audience
- Variants and allocation
- Primary and secondary metrics
- Exposure event
- Guardrail metrics
- Minimum runtime and stopping criteria

Do not change traffic split, metrics, or variants mid-run without explaining how it affects interpretation.

## Diagnosis

For weak or surprising results, check exposure volume, variant balance, metric event quality, sample ratio mismatch, bot traffic, mid-run changes, seasonality, and implementation bugs.

## Output

State whether the flag or experiment is healthy, risky, stale, or blocked. Include evidence and a safe next step.
