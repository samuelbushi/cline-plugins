---
name: aws-serverless-durable-functions
description: Build and review AWS Lambda durable functions for resilient, replay-safe, long-running workflows with checkpoints, retries, waits, callbacks, and compensation.
---

# AWS Serverless Durable Functions

Use this skill when the user mentions Lambda durable functions, checkpointed Lambda workflows, replay safety, saga patterns, human callbacks, long-running stateful Lambda executions, retry orchestration, or durable testing.

## Workflow

1. Confirm language and framework. Prefer TypeScript unless the project or user chooses Python or JavaScript.
2. Confirm whether the task is architecture, code generation, local tests, cloud tests, or deployment.
3. Model the workflow as deterministic orchestration plus side-effecting steps. Put non-deterministic code inside named steps.
4. Treat calls to APIs, databases, queues, email, payments, time, random values, and generated IDs as side effects that need step boundaries or idempotency.
5. Use explicit retry and timeout behavior for every external dependency.
6. Add compensation steps for workflows that partially mutate external systems.
7. Design callback and wait patterns with expiration, correlation IDs, and safe retry behavior.
8. Add local tests for replay behavior and step failure behavior before suggesting deployment.

## Replay Rules

- Do not use `Date.now`, random values, network calls, database writes, file writes, or mutable global state directly in the orchestrating path.
- Do not rely on closure mutations surviving replay.
- Return values from steps and pass explicit state between steps.
- Make every step idempotent or guarded by a durable external id.

## MCP Use

Use `aws-serverless-mcp` for serverless guidance, deployment helpers, and examples only when it materially improves the answer. Keep inputs sanitized and limited to the workflow shape, code snippets, or approved resource identifiers.

## Safety

Ask before installing SDKs, modifying infrastructure, deploying workflows, invoking live executions, reading execution history, reading logs, changing IAM, or touching production resources.

For human-in-the-loop or callback workflows, avoid exposing personal data, tokens, callback URLs, or payloads in chat unless the user explicitly provides sanitized examples.
