---
name: aws-dev-cost-optimization
description: Estimate, investigate, and optimize AWS costs using pricing assumptions, waste checks, rightsizing, Savings Plans, data transfer review, and governance.
---

# AWS Dev Cost Optimization

Use this skill when the user wants a cost estimate, cost comparison, bill investigation, rightsizing plan, or cost governance strategy.

Safety rules:

- Ask before reading Cost Explorer, budgets, account inventories, billing data, or pricing assumptions tied to private architecture.
- Treat spend, usage, account IDs, reservations, business forecasts, and architecture details as sensitive.
- Do not change budgets, purchase commitments, resize resources, delete resources, or alter lifecycle policies without explicit confirmation.
- Use `awspricing` for public pricing lookups and AWS CLI Cost Explorer only after the user approves the scope.

Workflow:

1. Clarify region, workload shape, traffic, storage, data transfer, availability target, and time horizon.
2. Separate baseline cost, variable cost, and one-time migration or build cost.
3. Use actual pricing numbers where possible and label assumptions when estimating.
4. Look for common waste: idle EBS volumes, unattached IPs, oversized compute, NAT Gateway data processing, unbounded logs, old snapshots, and storage class mismatch.
5. Compare reserved capacity, Savings Plans, Spot, Graviton, storage lifecycle, caching, and managed-service alternatives.
6. Rank recommendations by savings, risk, effort, and reversibility.
7. Include monitoring and budget guardrails so savings do not regress.

Never present a precise bill forecast without stating the assumptions and confidence level.
