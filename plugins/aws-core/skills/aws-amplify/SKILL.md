---
name: aws-amplify
description: Build and deploy AWS Amplify Gen 2 web and mobile apps with auth, data, storage, functions, APIs, AI features, frontend integration, sandbox validation, and production deployment.
---

# AWS Amplify

Use this skill for Amplify Gen 2 projects. Do not use it for Amplify Gen 1 CLI projects or standalone CDK and SAM work.

## Operating Rules

- Ask before installing packages, scaffolding projects, editing infrastructure files, running `npx ampx`, deploying, setting secrets, creating IAM roles, or invoking AWS APIs.
- Use `aws-mcp` when available for current Amplify guidance.
- Before querying `aws-mcp`, reduce the request to a sanitized docs or API question. Do not include secrets, account IDs, customer data, private code, log payloads, billing details, or confidential architecture.
- Keep credentials, tokens, secret values, and `amplify_outputs.json` out of commits and chat.
- If the user only wants backend work, do not add frontend integration unless asked.

## Workflow

1. Inspect for `amplify/backend.ts`, `amplify_outputs.json`, and `package.json`.
2. If `amplify/.config/` exists without `amplify/backend.ts`, stop and explain that this is likely Gen 1.
3. Identify the app target: React, Next.js, Vue, Angular, React Native, Flutter, Swift, or Android.
4. Route the work: auth, data, storage, functions and APIs, AI, frontend integration, sandbox, or production deployment.
5. Show the files and commands before changing anything.

## Safety Checks

- Ask which auth method the user wants. Do not assume.
- Call out unauthenticated or broad data and storage access.
- Use `secret()` or AWS secret stores for sensitive function values.
- Prefer one-shot sandbox commands in agent and CI contexts.
