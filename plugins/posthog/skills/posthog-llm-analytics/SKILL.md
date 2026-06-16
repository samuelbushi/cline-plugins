---
name: posthog-llm-analytics
description: This skill should be used when the user asks to instrument or analyze PostHog LLM analytics, AI traces, costs, evaluations, model latency, token usage, cache accounting, conversations, spans, or LLM product observability.
---

# PostHog LLM Analytics

Use this skill for AI product observability in PostHog.

## Instrumentation

Clarify whether the user is instrumenting their own app, backend, agent, or evaluation pipeline. Do not enable automatic Cline session telemetry from this plugin.

Capture useful fields:

- Trace or conversation identifier
- Model and provider
- Input and output token counts
- Latency
- Cost fields when available
- Cache read/write accounting
- User or account segment with privacy review
- Tool calls or retrieval spans when relevant

Avoid storing raw prompts, outputs, or user data unless the user has confirmed privacy expectations.

## Analysis

For cost or latency questions, segment by model, route, customer tier, cache behavior, prompt version, and deployment. For quality questions, connect traces to eval results or user outcomes.

## Output

Report trend, drivers, outliers, and recommended instrumentation or product changes. Include caveats around missing cost fields or sampled traces.
