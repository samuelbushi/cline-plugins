---
name: aws-serverless-deployment
description: Plan, review, validate, and deploy AWS serverless applications with SAM, CDK, CloudFormation, and serverless CI/CD workflows.
---

# AWS Serverless Deployment

Use this skill for SAM templates, CDK serverless stacks, CloudFormation review, serverless CI/CD, local Lambda testing, deployment troubleshooting, and production readiness checks.

## Workflow

1. Detect the IaC framework from the repository. Look for `template.yaml`, `template.yml`, `samconfig.toml`, `cdk.json`, `lib/`, `stacks/`, `bin/`, and CI pipeline files.
2. Keep the existing framework unless the user asks to migrate.
3. For new projects, prefer CDK TypeScript when the user wants a larger typed app and SAM when the user wants a compact Lambda-first project.
4. Separate stateful and stateless resources. Add deletion protection, retention policies, backups, or termination protection when appropriate.
5. Require least-privilege IAM, explicit regions, deterministic names where needed, tagged resources, log retention, and environment-specific config.
6. Before any deployment, produce a short deployment plan with expected resources, IAM impact, public endpoints, data stores, estimated cost drivers, and rollback path.
7. Prefer local checks such as `cdk synth`, `sam validate --lint`, `sam build`, or unit tests before deployment. Treat `cdk diff` as a live-account read: ask first and confirm the target account, region, and profile.

## Explicit Validation

Do not run validation automatically after file edits. When the user asks for validation or approves it, use the smallest relevant command:

```bash
sam validate --template template.yaml --lint
```

For CDK projects, prefer:

```bash
cdk synth
```

Only run commands in the user's workspace after explaining what they do. Ask before `cdk diff` because it can use live AWS account context.

## MCP Use

Use `aws-serverless-mcp` for SAM project initialization, generated serverless templates, deployment helpers, EventBridge schema workflows, and serverless troubleshooting when it is more precise than general shell commands.

Because the MCP server is registered with write access, ask before every MCP operation that can create files, deploy stacks, change domains, update assets, mutate AWS resources, or incur cost.

## Safety

Never deploy, delete, update, or roll back infrastructure without explicit approval. Ask before reading logs, invoking live functions, accessing production accounts, changing DNS, creating certificates, updating IAM, creating public endpoints, or invalidating CloudFront caches.

Do not print or commit credentials. Do not include secrets in CloudFormation, CDK context, SAM config, Lambda environment variables, build logs, or chat output.
