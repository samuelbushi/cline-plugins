---
name: base44-sdk
description: Use this skill for building JavaScript or TypeScript features in an existing Base44 project with @base44/sdk entities, auth, functions, integrations, analytics, users, connectors, SSO, and app logs.
---

# Base44 SDK

Use this skill for code that calls Base44 services from an initialized project.

## When To Use

Use this skill when:

- `base44/config.jsonc` exists.
- The project imports `@base44/sdk`.
- The user asks to implement a feature in a Base44 app.
- The task needs entities, auth, functions, integrations, analytics, users, connectors, SSO, or app logs.

If the workspace is not initialized as a Base44 project, use `base44-cli` first.

## API Names To Prefer

Do not assume SDK names from Firebase, Supabase, or generic REST clients. Use Base44 method names:

- Auth login with provider: `auth.loginWithProvider("google")`.
- Email/password login: `auth.loginViaEmailPassword(email, password)`.
- Register user: `auth.register({ email, password })`.
- Current user: `await auth.me()`.
- Invoke backend function: `functions.invoke("functionName", data)`.
- Entity create: `entities.Task.create(data)`.
- Entity list: `entities.Task.list()`.
- Entity get: `entities.Task.get(id)`.
- Entity filter: `entities.Task.filter(query, sort, limit, skip)`.
- Entity update: `entities.Task.update(id, data)`.
- Entity delete: `entities.Task.delete(id)`.
- LLM integration: `integrations.Core.InvokeLLM({ prompt })`.
- Send email: `integrations.Core.SendEmail({ to, subject, body })`.
- Upload file: `integrations.Core.UploadFile({ file })`.

For external apps, create a client with `createClient({ appId })`. Do not use `clientId` or `id` as the option name.

## Implementation Workflow

1. Inspect `base44/config.jsonc`, generated types, existing client setup, and the relevant entity/function definitions.
2. Confirm whether the code runs in the frontend, a backend function, or a service-role context.
3. Use generated TypeScript types when present.
4. Keep auth and service-role code separated. Do not put service-role secrets in frontend code.
5. Add error handling around remote calls and make loading/empty/error UI states explicit.
6. Ask before adding analytics, app logs, outbound email, file uploads, connector calls, or AI integrations that may send user data to external services.

## Guardrails

- Ask before installing `@base44/sdk`, generating types, invoking live functions, sending emails, uploading files, tracking analytics, reading app logs, or using service-role connector/SSO APIs.
- Do not print tokens, app IDs, connector credentials, SSO tokens, customer data, uploaded file contents, or production log payloads unless the user explicitly asks.
- Do not invent SDK methods. If uncertain, inspect the project, generated types, or installed package before writing code.
