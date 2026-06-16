# AWS Serverless

Build, review, and operate AWS Lambda, API Gateway, Step Functions, SAM, CDK, durable functions, and Lambda Managed Instances workflows from Cline.

## What It Adds

- Registers `aws-serverless-mcp`, a local AWS Serverless MCP server launched with `uvx`.
- Bundles `aws-serverless-lambda` for Lambda event sources, orchestration, observability, optimization, and troubleshooting.
- Bundles `aws-serverless-api-gateway` for REST, HTTP, and WebSocket API design and operations.
- Bundles `aws-serverless-deployment` for SAM, CDK, IaC review, deployment planning, and explicit template validation.
- Bundles `aws-serverless-durable-functions` for long-running Lambda workflows with checkpoints, retries, callbacks, and replay-safe code.
- Bundles `aws-serverless-managed-instances` for evaluating and migrating predictable Lambda workloads to Lambda Managed Instances.

## Install

```bash
cline plugin install aws-serverless
```

For local development from this repository:

```bash
cline plugin install ./plugins/aws-serverless --cwd .
```

## Example Usage

After installation, ask Cline:

```text
Review this SAM app for production readiness, then help me add a Lambda-backed HTTP API endpoint.
```

Cline can use the bundled skills to choose an AWS serverless design, consult the MCP server for serverless project helpers, and produce SAM or CDK changes with explicit approval before local validation, deployment, log access, or live AWS mutations.

## Cline Primitives

- MCP: `aws-serverless-mcp` exposes AWS Serverless tools for SAM project initialization, web app deployment helpers, Lambda testing, EventBridge schema workflows, and serverless guidance.
- Skills: five prefixed `aws-serverless-*` skills cover the main workflow lanes without requiring automatic hooks.

## Requirements

- `uvx` available on PATH.
- First launch may download and execute the pinned `awslabs.aws-serverless-mcp-server@0.1.19` package through `uvx`.
- Python 3.10 or newer available to `uvx`.
- AWS credentials configured through the AWS CLI, IAM Identity Center, or environment variables for live account operations.
- AWS SAM CLI, AWS CDK, Docker or a compatible container runtime, and AWS CLI as needed by the workflow.
- IAM permissions scoped to the requested Lambda, API Gateway, Step Functions, EventBridge, CloudFormation, S3, CloudFront, Route 53, ACM, IAM, CloudWatch, and related resources.

## Trust Boundaries

The MCP server is registered with `--allow-write` because project scaffolding, SAM deployment, web app deployment, EventBridge template generation, and domain configuration are core serverless workflows. Cline must still ask before running MCP tools or shell commands that create files, deploy stacks, change DNS or certificates, invoke Lambda functions, start or inspect Step Functions executions, read logs, mutate AWS resources, adjust IAM, change networking, invalidate caches, or incur cost.

Sensitive data access is not enabled. This plugin does not pass `--allow-sensitive-data-access`; users who need log-reading MCP tools should configure that intentionally in their own MCP settings and understand what data may be exposed.

This plugin does not run automatic post-edit hooks. SAM template validation is an explicit workflow step, not a command that runs after every file edit.
