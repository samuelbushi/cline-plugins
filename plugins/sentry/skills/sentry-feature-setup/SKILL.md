---
name: sentry-feature-setup
description: Configure specific Sentry features beyond basic SDK setup. Use when asked to monitor AI/LLM calls, set up OpenTelemetry pipelines, create alerts and notifications, or enable span streaming.
license: MIT
role: router
---


# Sentry Feature Setup

Configure specific Sentry capabilities beyond basic SDK setup - AI monitoring, OpenTelemetry pipelines, alerts, and deciding which signal to instrument where. This page helps you find the right feature skill for your task.

## How to Load Bundled Skills

This plugin bundles each feature skill locally. When this router selects a feature, read the bundled `../<skill-name>/SKILL.md` file from the table below and follow it directly. Do not fetch remote skill content unless the user explicitly asks for the latest upstream copy.

## Start Here - Read This Before Doing Anything

Do not skip this section. Do not assume which feature the user needs. Ask first.

1. If the user mentions AI monitoring, LLM tracing, conversations, or instrumenting an AI SDK (OpenAI, Anthropic, LangChain, Vercel AI, Google GenAI, Pydantic AI) -> `sentry-setup-ai-monitoring`
2. If the user mentions OpenTelemetry, OTel Collector, or multi-service telemetry routing -> `sentry-otel-exporter-setup`
3. If the user mentions alerts, notifications, on-call, Slack/PagerDuty/Discord integration, or workflow rules -> `sentry-create-alert`
4. If the user mentions span streaming, traceLifecycle, trace_lifecycle, spanStreamingIntegration, or switching from transactions to streamed spans -> `sentry-span-streaming-js` (JavaScript) or `sentry-span-streaming-python` (Python)
5. If the user is unsure which signal to use - log vs span vs metric, "what to instrument where", or how to choose between errors, traces, logs, and metrics -> `sentry-instrumentation-guide`

When unclear, ask the user which feature they want to configure. Do not guess.

---

## Feature Skills

| Feature | Skill | Path |
|---|---|---|
| AI/LLM monitoring and conversations - instrument OpenAI, Anthropic, LangChain, Vercel AI, Google GenAI, Pydantic AI | [`sentry-setup-ai-monitoring`](../sentry-setup-ai-monitoring/SKILL.md) | `sentry-setup-ai-monitoring/SKILL.md` |
| OpenTelemetry Collector with Sentry Exporter - multi-project routing, automatic project creation | [`sentry-otel-exporter-setup`](../sentry-otel-exporter-setup/SKILL.md) | `sentry-otel-exporter-setup/SKILL.md` |
| Alerts via workflow engine API - email, Slack, PagerDuty, Discord | [`sentry-create-alert`](../sentry-create-alert/SKILL.md) | `sentry-create-alert/SKILL.md` |
| Span streaming (JavaScript) - migrate from transaction-based to streamed span delivery | [`sentry-span-streaming-js`](../sentry-span-streaming-js/SKILL.md) | `sentry-span-streaming-js/SKILL.md` |
| Span streaming (Python) - migrate from transaction-based to streamed span delivery | [`sentry-span-streaming-python`](../sentry-span-streaming-python/SKILL.md) | `sentry-span-streaming-python/SKILL.md` |
| Instrumentation guide - decide which signal to reach for (error vs span vs log vs metric), "what to instrument where" | [`sentry-instrumentation-guide`](../sentry-instrumentation-guide/SKILL.md) | `sentry-instrumentation-guide/SKILL.md` |

Each skill contains its own detection logic, prerequisites, and step-by-step instructions. Trust the skill - read it carefully and follow it. Do not improvise or take shortcuts.

---

Looking for SDK setup or debugging workflows instead? Use the bundled `sentry-sdk-setup` or `sentry-workflow` skill.
