---
name: aws-dev-well-architected
description: Run AWS Well-Architected style reviews and health checks across security, reliability, operational excellence, performance, cost, and sustainability.
---

# AWS Dev Well Architected

Use this skill for formal or lightweight AWS Well-Architected reviews, account health checks, workload risk assessment, and improvement planning.

Safety rules:

- Ask before inspecting live accounts, running health checks, reading logs, checking billing, or enumerating resources.
- Treat findings, account IDs, resource names, costs, security posture, and architecture details as sensitive.
- Start with read-only checks. Do not remediate, enable services, change IAM, or delete resources without explicit confirmation.
- Verify current Well-Architected guidance and service-specific best practices with `awsknowledge`.

Workflow:

1. Scope the workload, account, regions, pillars, criticality, compliance needs, and review depth.
2. Gather architecture context from diagrams, IaC, deployment docs, and approved read-only AWS checks.
3. Review the six pillars: operational excellence, security, reliability, performance efficiency, cost optimization, and sustainability.
4. Prioritize high-risk issues first, especially public exposure, missing backups, missing observability, weak IAM, no rollback, and unmanaged cost.
5. Rate findings by risk and effort, then create a sequenced improvement plan.
6. Include evidence for each finding without dumping raw command output.
7. Separate must-fix production risks from nice-to-have maturity improvements.

A Well-Architected review is only useful if it produces owners, next actions, and a realistic order of operations.
