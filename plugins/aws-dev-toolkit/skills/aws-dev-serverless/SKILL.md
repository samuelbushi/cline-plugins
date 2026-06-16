---
name: aws-dev-serverless
description: Design and review AWS serverless systems using Lambda, API Gateway, Step Functions, EventBridge, SQS, SNS, DynamoDB, and related patterns.
---

# AWS Dev Serverless

Use this skill for event-driven architecture, Lambda design, API Gateway, Step Functions, queues, topics, EventBridge, DynamoDB-backed workflows, and serverless cost or performance tuning.

Safety rules:

- Ask before deploying functions, invoking production functions, changing event sources, updating API Gateway, modifying state machines, or reading logs.
- Treat event payloads, logs, API routes, customer identifiers, table keys, and DLQ contents as sensitive.
- Do not change concurrency, permissions, retries, destinations, or data models without confirmation.
- Verify quotas, runtime support, integration behavior, and region support with `awsknowledge` when needed.

Workflow:

1. Clarify request pattern, latency, throughput, payload size, retry tolerance, idempotency, and data consistency needs.
2. Use Lambda for focused compute, Step Functions for orchestration, EventBridge for routing, SQS for buffering, SNS for fanout, and DynamoDB for low-latency key-value access.
3. Prefer HTTP API over REST API unless advanced REST features are required.
4. Add retries, DLQs or destinations, idempotency keys, structured logs, tracing, and alarms.
5. Check cold starts, memory sizing, concurrency, timeout, package size, and VPC needs.
6. For Step Functions, default to Standard for auditable workflows and Express for high-volume short workflows.
7. For DynamoDB, design access patterns before keys and indexes.

Do not wrap simple AWS service integrations in Lambda when Step Functions can call the service directly.
