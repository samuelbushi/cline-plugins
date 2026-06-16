---
name: aws-serverless
description: Build, deploy, debug, and optimize AWS serverless applications with Lambda, API Gateway, Step Functions, EventBridge, SAM, CDK, DynamoDB streams, SQS event sources, CORS, cold starts, concurrency, SnapStart, Powertools, and production readiness.
---

# AWS Serverless

Use this skill for Lambda-centered and event-driven serverless applications on AWS.

## Operating Rules

- Ask before deploying, changing concurrency, creating event sources, invoking production functions, reading logs, or changing IAM.
- Do not print secrets from environment variables, logs, request payloads, or traces.
- Use `aws-mcp` when current runtime support, quotas, service behavior, or error details matter.
- Before querying `aws-mcp`, reduce the request to a sanitized docs or API question. Do not include secrets, account IDs, customer data, private code, log payloads, billing details, or confidential architecture.
- Separate local code changes from live account actions.

## Workflow

1. Identify the surface: Lambda, API Gateway, Step Functions, EventBridge, SQS, DynamoDB streams, SAM, CDK, Powertools, or production readiness.
2. For new architectures, choose the simplest event flow and explain why.
3. For Lambda, review runtime, handler, memory, timeout, env vars, IAM role, VPC config, layers, and packaging.
4. For API issues, separate auth, CORS, integration mapping, timeout, throttling, and backend errors.
5. For event sources, review batch size, retry, DLQ, partial failure, ordering, and idempotency.
6. For production, review alarms, tracing, structured logs, least privilege, concurrency, and rollback.

## Safety Checks

- Confirm account, region, function, stack, and stage before live commands.
- Prefer one-shot deploy and validation commands over watchers.
- Keep destructive operations behind explicit approval.
