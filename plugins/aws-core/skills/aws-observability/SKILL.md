---
name: aws-observability
description: Configure, debug, and optimize AWS observability with CloudWatch metrics, logs, Logs Insights, alarms, dashboards, X-Ray, CloudTrail, ADOT, OpenTelemetry, synthetics, canaries, and operational troubleshooting.
---

# AWS Observability

Use this skill for metrics, logs, traces, alarms, dashboards, CloudTrail, ADOT, and synthetics on AWS.

## Operating Rules

- Ask before querying account logs, creating alarms, changing dashboards, enabling tracing, deploying collectors, or creating canaries.
- Do not print secrets, tokens, customer data, or sensitive log payloads.
- Use `aws-mcp` when alarm behavior, query syntax, runtime support, or quotas need current guidance.
- Before querying `aws-mcp`, reduce the request to a sanitized docs or API question. Do not include secrets, account IDs, customer data, private code, log payloads, billing details, or confidential architecture.
- Prefer targeted read-only diagnostics before changing monitoring resources.

## Workflow

1. Identify the need: Logs Insights query, alarm, dashboard, metric, trace, CloudTrail audit, canary, ADOT collector, or troubleshooting.
2. Confirm account, region, log group, namespace, metric, resource, and time range before live queries.
3. For alarms, define metric, threshold, period, evaluation periods, missing data treatment, and action targets.
4. For logs, write focused queries with time bounds and redact sensitive fields in summaries.
5. For traces, separate sampling, propagation, instrumentation, collector config, and service map gaps.

## Safety Checks

- Keep dashboards actionable and scoped.
- Avoid high-cardinality metrics unless justified.
- Encrypt and retain logs according to data sensitivity.
- Document what each alarm means and what action it should trigger.
