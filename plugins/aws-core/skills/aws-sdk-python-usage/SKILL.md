---
name: aws-sdk-python-usage
description: Write and troubleshoot Python code using boto3 and botocore, including clients, resources, sessions, credentials, paginators, waiters, ClientError handling, S3 transfers, DynamoDB, retries, and configuration.
---

# AWS SDK For Python

Use this skill when code imports `boto3` or `botocore`, or when the user asks for AWS SDK work in Python.

## Operating Rules

- Ask before running code that calls live AWS services or changes resources.
- Do not print credentials, tokens, presigned URLs, secret env vars, or sensitive payloads.
- Prefer explicit sessions when profile, region, or account context matters.
- Use `aws-mcp` for current service API details when needed.
- Before querying `aws-mcp`, reduce the request to a sanitized docs or API question. Do not include secrets, account IDs, customer data, private code, log payloads, billing details, or confidential architecture.

## Workflow

1. Identify whether a client or resource interface is appropriate. Clients cover all APIs; resources are helpful only for supported services.
2. Configure region, retry behavior, timeouts, and credentials through the normal AWS provider chain or approved profiles.
3. Reuse clients and resources rather than creating them repeatedly in loops.
4. Use paginators for list operations and waiters for state transitions.
5. Catch `botocore.exceptions.ClientError` and branch on error code.
6. For S3 transfers, use managed transfer helpers for large files and bound memory usage.

## Safety Checks

- Avoid broad scans without filters or pagination limits.
- Redact account data and object keys when they are sensitive.
- Keep destructive calls behind explicit user confirmation.
