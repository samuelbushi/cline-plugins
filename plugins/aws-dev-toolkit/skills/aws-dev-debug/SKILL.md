---
name: aws-dev-debug
description: Debug AWS deployment failures, runtime errors, permissions issues, networking problems, and service misbehavior with a structured evidence-first workflow.
---

# AWS Dev Debug

Use this skill for CloudFormation failures, Lambda errors, ECS task failures, IAM access denied errors, networking timeouts, Terraform drift, CDK bootstrap issues, and other AWS incidents.

Safety rules:

- Ask before running AWS CLI, SAM, CDK, Terraform, log reads, state reads, or diagnostic commands.
- Treat logs, stack events, ARNs, resource names, account IDs, Terraform state, and error payloads as sensitive.
- Start read-only. Do not apply fixes, retry deployments, change permissions, restart services, or delete resources without explicit confirmation.
- For docs or error interpretation, sanitize requests to `awsknowledge`.

Workflow:

1. Identify the symptom, failing resource, time window, account, region, and recent change.
2. Verify caller identity and tool availability only after approval.
3. Gather the narrowest evidence first: stack events, service status, task or function status, logs for the relevant time window, and IAM simulation when appropriate.
4. Form a hypothesis and run one targeted check to confirm or reject it.
5. Propose the smallest fix with blast radius and rollback.
6. After confirmation, implement or guide the fix.
7. Add prevention: tests, alarms, deployment checks, IaC validation, or runbook updates.

Do not dump raw JSON. Summarize evidence and include only the lines needed to justify the root cause.
