---
name: azure-observability
description: Use this skill for Azure diagnostics, Application Insights, Log Analytics, Kusto/KQL, resource visualization, reliability investigations, and production troubleshooting.
---

# Azure Observability

Use this skill for diagnosing Azure applications and infrastructure with logs, metrics, traces, Application Insights, Log Analytics, and resource topology.

## Workflow

1. Start with the symptom, time window, affected users, deployment history, and target resources.
2. Prefer read-only diagnostics: health, recent deployments, metrics, logs, traces, dependencies, exceptions, alerts, and resource topology.
3. When writing KQL, keep queries scoped by time, resource, operation, and sampling limits.
4. Correlate code changes, infrastructure changes, deployments, and Azure incidents before recommending fixes.
5. Summarize confidence, evidence, and next validation steps separately from hypotheses.

## Guardrails

- Ask before querying live logs, traces, customer data, production metrics, or incident data.
- Do not paste secrets, tokens, PII, request bodies, or customer identifiers from logs into summaries.
- Ask before changing diagnostic settings, retention, alerts, action groups, autoscale rules, or production resources.
- Use narrow time ranges and filters before broad tenant or subscription queries.
