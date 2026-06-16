---
name: azure-cost-quota
description: Use this skill for Azure cost estimation, budget review, pricing tradeoffs, quota checks, capacity planning, SKU selection, and quota increase workflows.
---

# Azure Cost And Quota

Use this skill when the user asks about Azure spend, pricing, capacity, quota, service limits, or SKU tradeoffs.

## Workflow

1. Identify the workload, region, expected traffic, storage volume, retention, availability needs, and environment count.
2. Prefer estimates from architecture and SKU assumptions before reading live billing data.
3. For live cost or quota checks, confirm subscription and scope first.
4. Compare low, expected, and high usage cases when the workload is uncertain.
5. Suggest budget alerts, tagging, autoscaling limits, retention policies, and right-sizing options.

## Guardrails

- Ask before querying live cost, billing, usage, reservation, or quota data.
- Ask before creating budgets, alerts, quota requests, reservations, savings plans, or capacity commitments.
- Treat pricing estimates as approximate and state the key assumptions.
- Do not expose account IDs, invoice details, customer names, or internal cost centers unless the user explicitly asks.
