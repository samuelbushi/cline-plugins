---
name: amplitude-ai-visibility
description: Analyze Amplitude Agent Analytics and AI Visibility data, including AI session quality, topics, failures, cost, performance, sentiment, and agent result summaries. Use only when the user has Amplitude Agent Analytics or AI Visibility instrumented.
---

# Amplitude AI Visibility

Use this skill only when the user has Amplitude Agent Analytics, AI Visibility, or equivalent AI-session instrumentation in Amplitude.

## Health Monitoring

1. Get Amplitude context and available AI schema first.
2. Query quality, success rate, failure rate, sentiment, cost, latency, agent breakdowns, tool stats, and error categories.
3. Pull time series for recent regressions and spikes.
4. Sample recent failed or low-quality sessions for qualitative explanation.
5. Attribute issues to agent, topic, tool, model, prompt path, latency, cost driver, or missing product capability.
6. Recommend concrete fixes such as routing, prompt, tool, retrieval, product workflow, or instrumentation changes.

## Topic Analysis

1. Identify the user's scope: agent, topic model, timeframe, product area, or quality threshold.
2. Query topic breakdowns with volume, quality, sentiment, and failure rate.
3. Build a volume-by-quality view:
   - High volume and low quality: fix first.
   - Low volume and low quality: investigate for emerging gaps.
   - High volume and high quality: maintain.
   - Low volume and high quality: monitor.
4. Deep-dive into top underserved topics with representative sessions, failure reasons, and tool traces.
5. Turn findings into product and agent-improvement decisions.

## Session Investigation

For a specific bad session or complaint:

1. Find the matching AI session by ID, user, timeframe, agent, or topic.
2. Pull detailed session data, conversation transcript, and spans.
3. Identify what went wrong: wrong answer, missing tool, tool error, slow response, retrieval failure, refusal, hallucination, bad routing, or product gap.
4. Compare against similar sessions to determine whether it is isolated or systemic.
5. Return root cause, evidence, affected scope, and recommended fix.

Protect user privacy. Do not paste raw conversation transcripts into committed files or broad reports unless the user explicitly asks and the data is appropriate to share.
