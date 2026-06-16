---
name: aws-iam
description: Design, review, and troubleshoot AWS IAM policies, roles, trust policies, permission boundaries, SCPs, resource policies, condition keys, identity center access, least privilege, Access Analyzer findings, and authorization failures.
---

# AWS IAM

Use this skill for AWS identity, permissions, and authorization troubleshooting.

## Operating Rules

- Ask before changing policies, roles, trust relationships, permission boundaries, SCPs, or identity assignments.
- Treat IAM changes as high-impact. Explain blast radius and rollback before action.
- Do not print access keys, session tokens, SSO tokens, or private key material.
- Use `aws-mcp` when condition key behavior, service authorization references, or policy syntax needs current guidance.
- Before querying `aws-mcp`, reduce the request to a sanitized docs or API question. Do not include secrets, account IDs, customer data, private code, log payloads, billing details, or confidential architecture.

## Workflow

1. Identify the principal, action, resource, account, region, and exact deny or access error.
2. Determine all policy layers: identity policy, resource policy, permissions boundary, session policy, SCP, VPC endpoint policy, KMS key policy, and service-specific controls.
3. For new permissions, write the narrowest policy that satisfies the stated use.
4. For denies, look for explicit deny first, then missing allow, resource mismatch, condition mismatch, and trust policy failure.
5. Use Access Analyzer or policy simulation when appropriate and approved.

## Safety Checks

- Avoid `*` actions and resources unless justified and time-bounded.
- Add `aws:SourceAccount`, `aws:SourceArn`, external IDs, MFA, or tag conditions where they reduce risk.
- Never create long-lived access keys unless the user explicitly requires them and understands the risk.
