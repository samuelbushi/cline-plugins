---
name: aws-sdk-swift-usage
description: Write and troubleshoot Swift code using AWS SDK for Swift, including async clients, struct-based config, regions, credentials, S3, DynamoDB, Lambda, paginators, waiters, and error handling.
---

# AWS SDK For Swift

Use this skill when writing Swift code with AWS SDK for Swift.

## Operating Rules

- Ask before running code that calls live AWS services or changes resources.
- Do not print credentials, tokens, signed URLs, secret values, or sensitive payloads.
- Use current struct-based client config types, not deprecated configuration classes.
- Use `aws-mcp` for current service API details when needed.
- Before querying `aws-mcp`, reduce the request to a sanitized docs or API question. Do not include secrets, account IDs, customer data, private code, log payloads, billing details, or confidential architecture.

## Workflow

1. Identify the target: command-line Swift, server-side Swift, iOS, macOS, or another Apple platform.
2. Use async entry points and `async throws` service calls.
3. Create clients with explicit region when the environment does not provide one.
4. Use service namespaced model types and generated input structs.
5. Use paginators or bounded loops for list operations.
6. Handle service errors and retryable failures explicitly.

## Safety Checks

- Keep credentials in the AWS credential chain or platform-specific secret stores.
- Avoid blocking async work on the main actor.
- Bound downloads, uploads, and list calls.
