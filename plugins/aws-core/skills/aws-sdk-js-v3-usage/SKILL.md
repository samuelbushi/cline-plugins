---
name: aws-sdk-js-v3-usage
description: Write and troubleshoot JavaScript and TypeScript code using AWS SDK for JavaScript v3, including clients, commands, credentials, retries, pagination, waiters, S3, DynamoDB, Lambda, schemas, and TypeScript patterns.
---

# AWS SDK For JavaScript V3

Use this skill when code imports `@aws-sdk/*` packages or the user asks for AWS SDK work in JavaScript or TypeScript.

## Operating Rules

- Ask before running code that calls live AWS services or changes resources.
- Do not print credentials, tokens, signed URLs, secret env vars, or sensitive payloads.
- Use modular v3 clients and commands. Do not use v2 `aws-sdk` patterns unless maintaining legacy code.
- Use `aws-mcp` for current service API details when needed.
- Before querying `aws-mcp`, reduce the request to a sanitized docs or API question. Do not include secrets, account IDs, customer data, private code, log payloads, billing details, or confidential architecture.

## Workflow

1. Identify runtime: Node.js, browser, Lambda, edge, React Native, or bundler.
2. Import clients and commands from package roots, such as `@aws-sdk/client-s3`.
3. Configure region and credentials through the default provider chain, profiles, roles, or explicit approved providers.
4. Reuse clients instead of creating them inside hot loops.
5. Use paginators for list operations and waiters for eventual state transitions.
6. Handle modeled service errors and retryable failures explicitly.

## Safety Checks

- Avoid hardcoded credentials and account IDs.
- Redact presigned URLs unless the user explicitly needs them.
- Bound list operations and data reads.
- Use TypeScript types for request and response shapes.
