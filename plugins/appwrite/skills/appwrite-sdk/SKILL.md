---
name: appwrite-sdk
description: Use when writing Appwrite SDK code for web, mobile, backend, or server-side apps. Covers client setup, auth, storage, realtime, functions, and server-side API key boundaries.
---

# Appwrite SDK

Use this skill when the task involves Appwrite SDK code in TypeScript, JavaScript, React Native, Flutter, Dart, Kotlin, Swift, Python, Ruby, Go, Rust, .NET, PHP, or another supported runtime.

## Client Boundaries

- Browser and mobile clients should use endpoint plus project ID only.
- Server-side clients can use endpoint, project ID, and an API key loaded from environment variables.
- Never hard-code API keys, JWTs, session secrets, or project credentials in source files.
- Prefer the SDK idioms already used in the repository before changing style.
- For new database work, prefer TablesDB APIs. Use legacy Databases APIs only when the existing codebase already depends on them or the user explicitly asks for it.

## Setup Pattern

When adding SDK setup, identify the runtime first:

- Web: use the browser SDK package and create `Client`, `Account`, `TablesDB`, `Storage`, and `Realtime` from the client.
- React Native: use the React Native SDK package. Do not use browser OAuth session helpers that rely on regular web redirects.
- Node.js or server runtimes: use the server SDK package and read `APPWRITE_ENDPOINT`, `APPWRITE_PROJECT_ID`, and `APPWRITE_API_KEY` from environment variables.
- Mobile or desktop native runtimes: use the platform SDK and follow platform-specific file and OAuth flows.

## Auth Guidance

- Use account/session APIs only on client-side user flows.
- Use users/admin APIs only from trusted server-side code with an API key.
- For React Native OAuth, use a token plus deep-link flow instead of browser-only OAuth session helpers.
- Avoid creating admin users, deleting users, or modifying auth providers unless the user explicitly requested that operation.

## Storage And Realtime

- For uploads, use the platform-native file input type expected by the SDK.
- Validate bucket IDs, file IDs, MIME type assumptions, and permissions before writing code.
- Subscribe to realtime channels narrowly. Unsubscribe on teardown or component unmount.
- Do not subscribe to broad wildcard channels unless the user asks and the blast radius is clear.

## Functions

- Treat function executions as server-side side effects.
- Inspect payload shape, timeout assumptions, and auth context before invoking a function.
- Do not deploy or execute production functions without explicit user approval.

## Implementation Checklist

- Confirm endpoint, project ID, database ID, table ID, bucket ID, and function ID sources.
- Preserve existing SDK package versions and code style where possible.
- Use environment variables for secrets and update local examples with placeholders only.
- Add error handling around Appwrite SDK calls so API errors surface with useful context.
