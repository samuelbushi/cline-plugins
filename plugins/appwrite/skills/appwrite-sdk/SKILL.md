---
name: appwrite-sdk
description: Use when the user asks generally for Appwrite SDK help and the implementation language is unclear or mixed. Route to the language-specific Appwrite SDK skills after identifying the target runtime.
---

# Appwrite SDK Router

Use this skill as the compatibility and dispatch layer for Appwrite SDK work.
When the language or runtime is known, load the matching focused skill:

| Runtime | Skill |
| --- | --- |
| TypeScript, JavaScript, React Native, Node.js, Deno | `appwrite-typescript-sdk` |
| Flutter, Dart | `appwrite-dart-sdk` |
| Android, Kotlin/JVM | `appwrite-kotlin-sdk` |
| iOS, macOS, Swift, server-side Swift | `appwrite-swift-sdk` |
| Python, Django, Flask, FastAPI | `appwrite-python-sdk` |
| Ruby, Rails, Sinatra | `appwrite-ruby-sdk` |
| Go | `appwrite-go-sdk` |
| Rust | `appwrite-rust-sdk` |
| .NET, C#, ASP.NET, Blazor | `appwrite-dotnet-sdk` |
| PHP, Laravel, Symfony | `appwrite-php-sdk` |

## How To Route

1. Identify the target runtime from the repository, package files, existing imports, or the user's request.
2. If the runtime is ambiguous, ask a short clarification before writing SDK code.
3. Load the focused language skill and follow its examples.
4. For database schema, table, row, permission, index, or migration design, also use `appwrite-tablesdb`.
5. For CLI setup, project pull/push, function deployment, or site deployment, use `appwrite-cli` and `appwrite-deployments`.
6. For live project inspection or mutation through MCP, use `appwrite-mcp`.

## Boundaries

- Browser and mobile clients should use endpoint plus project ID only.
- API keys belong in trusted server-side code or user-managed environment variables.
- Do not print, commit, or log Appwrite API keys, JWTs, session secrets, `.env` values, or credential-bearing config.
- Ask for explicit confirmation before project mutations, deletes, deployments, permission changes, function executions, or migrations.
