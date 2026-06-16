---
name: aws-cdk
description: Author, deploy, refactor, and troubleshoot AWS CDK apps in TypeScript or Python, including bootstrap, synth, diff, deploy, drift, cdk-nag, imports, migration, and safe refactors that avoid resource replacement.
---

# AWS CDK

Use this skill for AWS CDK apps. Use CloudFormation-specific guidance for raw templates and serverless guidance for SAM-first work.

## Operating Rules

- Ask before bootstrapping, deploying, destroying, importing resources, or changing IAM.
- Run or request `cdk diff` before deploy and before risky refactors.
- Treat construct ID changes, stack moves, and stateful resource changes as replacement risks.
- Use `aws-mcp` when exact CDK API behavior, service limits, or deployment errors need current guidance.
- Before querying `aws-mcp`, reduce the request to a sanitized docs or API question. Do not include secrets, account IDs, customer data, private code, log payloads, billing details, or confidential architecture.

## Workflow

1. Identify language, CDK version, app entrypoint, stack names, account, and region.
2. Inspect `cdk.json`, package files, app entrypoints, and stack definitions.
3. For new code, prefer L2 constructs and explicit names only when they are truly required.
4. For deploy failures, inspect CloudFormation events before guessing from the CDK error.
5. For refactors, separate logical ID preserving moves from behavior changes.

## Safety Checks

- Watch for replacement of databases, buckets, queues, domains, keys, and log groups.
- Use OIDC or roles for CI credentials, not long-lived keys.
- Use least-privilege grants and avoid broad wildcard policies.
- Add compliance checks only when they fit the project and do not mask real findings.
