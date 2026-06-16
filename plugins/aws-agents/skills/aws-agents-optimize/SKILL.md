---
name: aws-agents-optimize
description: Improve AWS AgentCore quality, observability, latency, cost, evals, dashboards, traces, online monitoring, and CI quality gates.
---

# AWS Agents Optimize

Use this skill when the user wants to measure or improve an AgentCore agent rather than diagnose a hard failure.

## Operating Rules

- Ask before enabling online evals, monitoring, dashboards, tracing, sampling, load tests, or any feature that can incur cost or collect production data.
- Keep evaluation datasets and logs free of secrets and unnecessary personal data.
- Prefer measuring before tuning.
- Use `awsknowledge` for current observability, eval, and service-limit guidance.

## Workflow

1. Identify the optimization goal:
   - Answer quality.
   - Tool reliability.
   - Latency.
   - Cost.
   - Observability and traces.
   - CI quality gate.
   - Production monitoring.
2. Read local project config and existing eval or observability settings.
3. Propose the smallest measurement plan:
   - Offline eval set for quality.
   - Trace review for latency and tool behavior.
   - Cost estimate from model, runtime, tool, and observability usage.
   - Dashboard or alert plan for production monitoring.
4. Ask before enabling live account features or running commands that invoke deployed agents.
5. Summarize findings with specific changes and expected tradeoffs.

## Good Output

Report baseline, bottleneck, recommended change, expected impact, and rollback path. If the user asks for CI gating, include a threshold and a failure mode that is easy for developers to understand.
