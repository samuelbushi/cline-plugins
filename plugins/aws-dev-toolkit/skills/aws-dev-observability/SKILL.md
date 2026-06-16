---
name: aws-dev-observability
description: Design and improve AWS observability with CloudWatch metrics, logs, alarms, dashboards, X-Ray, OpenTelemetry, and incident-ready signals.
---

# AWS Dev Observability

Use this skill when the user needs monitoring, dashboards, alarms, tracing, Logs Insights queries, SLOs, or observability troubleshooting on AWS.

Safety rules:

- Ask before reading logs, traces, metrics, dashboards, alarms, or incident data.
- Treat log payloads, traces, user identifiers, request paths, account IDs, and incident timelines as sensitive.
- Do not create alarms, change retention, alter dashboards, enable tracing, or update logging configuration without confirmation.
- Verify metric namespaces, dimensions, quotas, and feature support with `awsknowledge` when they are load-bearing.

Workflow:

1. Start from user-facing symptoms and SLOs, not from available metrics.
2. Identify the critical paths, dependencies, failure modes, and owners.
3. Choose signals: metrics for health, logs for details, traces for request flow, events for deployments and incidents.
4. Build actionable alarms on symptoms such as error rate, latency, saturation, and failed jobs.
5. Use composite alarms and missing-data behavior to reduce noise.
6. Include dashboards, runbooks, trace sampling, log retention, and cost controls.
7. For troubleshooting, query only the approved time window and redact sensitive fields from excerpts.

An alert that nobody can act on should be a dashboard metric, not a page.
