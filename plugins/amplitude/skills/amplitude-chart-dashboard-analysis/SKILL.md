---
name: amplitude-chart-dashboard-analysis
description: Analyze Amplitude charts and dashboards, explain trends, investigate anomalies, connect metrics to experiments or feedback, and prepare concise stakeholder summaries. Use when the user shares a chart or dashboard URL, asks why a metric moved, or wants meeting-ready takeaways.
---

# Amplitude Chart And Dashboard Analysis

Use this skill for chart deep dives, dashboard reviews, anomaly explanations, and stakeholder summaries.

## Chart Workflow

1. Identify the chart URL or ID. If missing, ask for it.
2. Retrieve the chart definition and data through Amplitude MCP. If data is unavailable, stop and explain what is missing.
3. Restate the metric, time range, chart type, filters, segments, and granularity.
4. Identify the pattern: spike, drop, gradual trend, seasonality, anomaly, or segment divergence.
5. Select a baseline comparison that matches the question. Avoid comparing partial periods to complete periods.
6. Investigate drivers with a bounded set of high-signal segments such as platform, country, plan, version, acquisition channel, or account type.
7. Check context for meaningful changes: experiments, deployments, annotations, feedback themes, and session replay patterns.
8. Deliver a concise answer with confidence, evidence, caveats, and next actions.

## Dashboard Workflow

1. Identify the dashboard URL or ID.
2. Fetch the dashboard structure and choose the most decision-relevant charts first.
3. Query charts in small batches and deduplicate repeated metrics.
4. Group findings into a few narratives instead of listing every chart.
5. Separate urgent risks from useful but non-urgent takeaways.
6. Prepare an audience-specific summary for executives, PMs, growth, engineering, or customer success.

## Output Style

- Lead with the top takeaway.
- Use numbers as evidence, not as the story.
- Include links or IDs for the charts that support each claim.
- Label confidence as high, medium, or low.
- Include no more than three immediate recommendations unless the user asks for depth.
- If the dashboard is healthy, say that directly and avoid inventing concerns.
