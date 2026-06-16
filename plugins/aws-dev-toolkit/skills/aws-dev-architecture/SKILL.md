---
name: aws-dev-architecture
description: Plan and compare AWS architectures across cost, security, reliability, performance, operational burden, and team fit.
---

# AWS Dev Architecture

Use this skill for AWS architecture planning, service selection, tradeoff analysis, and high-level design reviews.

Safety rules:

- Ask before inspecting a live AWS account, reading private IaC, querying pricing for confidential architecture, or proposing deployable commands.
- Treat architecture diagrams, account structure, traffic estimates, costs, and service names as sensitive unless the user says otherwise.
- Verify current AWS limits, region support, and service capabilities with `awsknowledge` before making load-bearing claims.
- Use `awspricing` for estimates only after confirming region, usage assumptions, and whether rough public pricing is acceptable.

Workflow:

1. Ask 3 to 5 high-signal discovery questions about workload, scale, compliance, team skills, timeline, and budget.
2. Start with the simplest managed AWS shape that meets the requirements.
3. Compare 2 or 3 options across cost, complexity, performance, security, reliability, team fit, and reversibility.
4. Recommend one option with explicit assumptions and caveats.
5. Include security, observability, deployment, rollback, and cost controls in the design.
6. If IaC or concrete configuration is produced, hand off to the IaC review skill before calling the plan done.

Avoid defaulting to the most powerful service. Good AWS architecture is usually the smallest operable design with a clear growth path.
