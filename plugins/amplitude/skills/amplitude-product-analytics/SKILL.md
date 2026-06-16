---
name: amplitude-product-analytics
description: Use Amplitude MCP as a product analytics partner for product questions, funnel analysis, cohorts, opportunities, metrics, charts, dashboards, experiments, feedback, and user or account behavior. Use when the user asks for product insights from Amplitude data or wants to investigate what is happening in their product.
---

# Amplitude Product Analytics

Use this skill when the user wants product or growth insight from Amplitude. Start with the available Amplitude MCP tools, but keep the analysis grounded in the user's stated decision.

## Workflow

1. Clarify the decision if the user only asks for a broad scan. Ask one focused question about the audience, product area, project, or metric that matters.
2. Use progressive discovery first: call `get_context`, then `list_tool_categories`, then `get_category_tools` for the relevant surface, and `describe_tool` before calling a specific tool for the first time.
3. Search before creating new analysis. Existing charts, dashboards, cohorts, notebooks, experiments, and opportunities often encode the team's current definitions.
4. Query the smallest useful dataset. Prefer chart or dashboard data when the user gave a URL. Use event and property discovery before building a custom query.
5. Validate before concluding. Check time windows, partial periods, sample size, segment concentration, recent deployments, experiments, and customer feedback where relevant.
6. End with the decision. Do not just narrate numbers. Explain what changed, why it likely changed, how confident you are, and what to do next.

## Good Defaults

- Ask for or infer project, date range, segment, and success metric.
- Use the last 30 days for product behavior unless the user asks for a different window.
- Use daily granularity for recent anomalies and weekly granularity for strategic trend summaries.
- Prefer existing canonical dashboards for executive or cross-functional questions.
- Use cohorts and segments when the core question is about who behaves differently.
- Use session replay or feedback only when the metric movement needs qualitative explanation.

## Guardrails

- Never guess event names or property names. Discover them through Amplitude MCP or codebase instrumentation patterns.
- Treat chart URLs, dashboard URLs, experiment URLs, and replay URLs as sensitive workspace context.
- Confirm before creating or editing charts, dashboards, cohorts, experiments, opportunities, taxonomy metadata, or other Amplitude content.
- Call out weak evidence clearly. If data is missing, permissions block access, or a result is underpowered, say so and propose the next query.
- Do not export or persist customer-level data unless the user explicitly asks and the workspace is appropriate for that data.
