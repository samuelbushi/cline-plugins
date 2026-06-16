---
name: aws-startup-build
description: Guide Cline through AWS startup build discovery and implementation for MVPs, production hardening, account setup, cost controls, and architecture scaffolding.
---

# AWS Startup Build

Use this skill when the user wants to build, scaffold, expand, harden, or refactor an application on AWS.

## Workflow

1. Inspect the codebase first. Look for language, framework, package manager, Dockerfiles, IaC, deployment scripts, README files, tests, and existing cloud assumptions.
2. Summarize what the repo already tells you in no more than seven sentences.
3. Ask only for human context that the repo cannot answer: goal, stage, scale, budget sensitivity, compliance, operational ownership, launch urgency, and preferred AWS account or region.
4. Favor simple managed AWS services for early-stage projects. Prefer serverless or managed containers before Kubernetes unless the repo already uses Kubernetes or the user requires it.
5. Build for the next order of magnitude, not for extreme scale. Note how to evolve when traffic, team size, or compliance needs increase.
6. Include cost guardrails early: budgets, alarms, log retention, storage lifecycle, and clear cost drivers.
7. Before implementation, show the files and resources likely to change. Ask for approval before live AWS access, deployments, IAM changes, or cost-bearing operations.
8. Validate locally where possible before suggesting deployment.

## Architecture Defaults

- Prefer Terraform if the repo has no IaC preference and the user wants reusable infrastructure.
- Prefer CDK or SAM when the repo already uses them or the user wants code-first serverless infrastructure.
- Prefer VPC endpoints for S3 and DynamoDB access when private networking is needed.
- Use least-privilege IAM and avoid broad wildcard permissions.
- For AI workloads, consider Bedrock, OpenSearch Serverless, Knowledge Bases, Lambda, Step Functions, and AgentCore only when they fit the user's actual requirements.

## MCP Use

Use `awsknowledge` for service guidance and `awspricing` for approved pricing estimates. Ask before sending architecture details or source snippets. Send only the minimum sanitized context.

## Safety

Do not deploy, create public endpoints, change IAM, create DNS records, request quotas, configure billing, read Cost Explorer, inspect account inventory, or run migration discovery without explicit approval.

Never place credentials in code, prompts, IaC variables, environment files, build logs, or chat output.
