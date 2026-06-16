---
name: aws-serverless-lambda
description: Design, build, test, debug, and optimize AWS Lambda applications, including event sources, Step Functions, EventBridge, observability, Powertools, and production readiness.
---

# AWS Serverless Lambda

Use this skill when the user is working on Lambda functions, event-driven architecture, Step Functions, EventBridge, Lambda Web Adapter, Lambda Powertools, Lambda performance, or Lambda troubleshooting.

## Workflow

1. Identify the workload, runtime, deployment framework, target account or region, and whether the task is design-only or should touch local files or AWS.
2. Inspect the repository before generating code. Look for `template.yaml`, `template.yml`, `samconfig.toml`, `cdk.json`, `package.json`, `pyproject.toml`, function handlers, event schemas, and CI workflows.
3. Prefer TypeScript for new examples unless the project or user chooses another runtime.
4. Prefer IaC for production resources. Use SAM for SAM projects, CDK for CDK projects, and do not mix frameworks unless the user asks.
5. For event sources, design idempotent handlers. Lambda delivery is at least once, so duplicate events must be safe.
6. Add observability early: structured logs, metrics, traces, correlation IDs, alarmable metrics, and bounded log retention.
7. Keep IAM least privilege. Avoid wildcard actions and wildcard resources unless the user explicitly accepts the risk.
8. When changing code, include local validation commands the user can approve, such as unit tests, `sam build`, `sam local invoke`, `cdk synth`, or linting.

## MCP Use

Use `aws-serverless-mcp` when serverless-specific tooling would help with SAM initialization, Lambda testing, EventBridge schema workflows, deployment guidance, or generated templates.

Before calling MCP tools, explain what will be sent and why. Use the minimum necessary project names, template snippets, resource identifiers, and payloads. Do not send secrets, credentials, customer data, full logs, or unrelated private code.

## Safety

Ask before live AWS API calls, Lambda invokes, deployments, stack changes, IAM changes, network changes, log reads, CloudWatch queries, cost-bearing actions, or any MCP write operation.

Do not assume `--allow-sensitive-data-access` is enabled for the MCP server. If a task needs logs or other sensitive runtime data, ask the user to approve the access path and prefer targeted AWS CLI commands over broad data dumps.

Never place credentials in Lambda environment variables, templates, prompts, generated examples, or committed files. Prefer Secrets Manager, SSM Parameter Store, IAM roles, and short-lived credentials.
