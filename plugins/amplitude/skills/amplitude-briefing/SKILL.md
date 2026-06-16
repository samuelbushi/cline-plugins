---
name: amplitude-briefing
description: Produce daily or weekly Amplitude briefs across dashboards, charts, experiments, feedback, opportunities, deployments, and product health. Use when the user asks for a morning brief, daily download, weekly review, executive summary, or what changed recently.
---

# Amplitude Briefing

Use this skill to produce a concise, decision-oriented product intelligence brief.

## Choose The Brief Type

- Daily brief: last 1 to 2 complete days, focused on anomalies, releases, incidents, experiment movement, and urgent follow-ups.
- Weekly brief: last 7 complete days with the prior 4 weeks as comparison, focused on trends, wins, risks, and next-week priorities.

If the user does not specify daily or weekly, infer from wording. Ask only when it changes the work.

## Workflow

1. Understand the audience: executive, PM, growth, analyst, engineering, customer success, or founder.
2. Bootstrap context from Amplitude MCP: projects, key dashboards, recent activity, official or highly viewed content, experiments, opportunities, feedback sources, and deployments.
3. Query the most important dashboards and charts first. Do not scan everything.
4. Compare against the right baseline. Daily briefings compare to recent days; weekly briefings compare week-over-week and trailing 4-week averages.
5. Filter false positives: partial periods, holidays, low sample size, one-day spikes, rolling windows, planned launches, and known deploys.
6. Investigate only the top findings deeply. Merge related metrics into one narrative.
7. End with concrete priorities.

## Output

- Opening headline: one sentence.
- Scope and verdict: what was scanned and the overall state.
- Key findings: 3 to 7 narrative findings with evidence and action.
- What's working: short narrative of positive momentum.
- Risks or areas of concern: only real risks.
- Next priorities: numbered, copy-paste-ready actions.
- Follow-on prompt: ask what the user wants to inspect next.

Keep the brief shareable. Avoid tool-call receipts, raw data dumps, and long lists of chart IDs unless requested.
