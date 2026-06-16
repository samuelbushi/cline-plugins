---
name: aws-billing-and-cost-management
description: Analyze AWS bills, Cost Explorer data, budgets, Free Tier usage, pricing, Savings Plans, Reserved Instances, Compute Optimizer recommendations, Cost Optimization Hub findings, CUR data, and cost anomalies.
---

# AWS Billing And Cost Management

Use this skill for AWS cost analysis and optimization.

## Operating Rules

- Ask before querying billing data, creating budgets, changing alerts, exporting CUR data, or making purchase recommendations.
- Before querying `aws-mcp`, reduce the request to a sanitized docs or API question. Do not include secrets, account IDs, customer data, private code, log payloads, billing details, or confidential architecture.
- Get the current date from a reliable source before any time-bounded billing query.
- Use scripts or calculator tools for arithmetic. Do not do billing math by reasoning in prose.
- Treat account IDs, cost data, tags, and usage patterns as sensitive business data.

## Workflow

1. Clarify the scope: account, payer, linked account, service, tag, billing view, date range, or workload.
2. Identify whether the user wants spend analysis, anomaly investigation, budget setup, pricing lookup, right-sizing, commitment planning, or Free Tier review.
3. Prefer Cost Explorer for high-level spend, pricing APIs for service pricing, Compute Optimizer for right-sizing, and CUR with Athena for detailed line items.
4. Ask before live billing API calls and explain expected data access.
5. Use deterministic scripts for sums, averages, percentages, forecasts, and comparisons.

## Good Output

Return the exact time range, filters, assumptions, calculation method, and recommended next action. Separate verified savings from rough estimates.
