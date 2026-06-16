---
name: auth0-quickstart
description: Use when adding Auth0 to a project from scratch or when the user asks which Auth0 integration path fits their app, API, SPA, mobile app, or server-rendered web app.
---

# Auth0 Quickstart

Use this skill to choose a safe Auth0 integration path before editing code.

## Discover

Inspect the project first:

- Framework and runtime.
- App type: browser SPA, server-rendered web app, API, mobile/native app, hybrid app, or mixed stack.
- Package manager and existing auth dependencies.
- Existing routes, middleware, auth guards, session stores, token storage, and environment files.
- Whether Auth0 domain, client ID, audience, callback URL, and logout URL are already provided.

## Route

Pick the more specific skill:

- `auth0-spa-integration` for browser-only SPAs.
- `auth0-webapp-integration` for session-based web apps.
- `auth0-api-jwt-protection` for stateless APIs receiving access tokens.
- `auth0-mobile-native-integration` for native, desktop, React Native, Expo, Flutter, Ionic, or .NET client apps.
- `auth0-tenant-operations` for tenant setup, applications, APIs, MFA, branding, Universal Login, custom domains, or CLI work.
- `auth0-migration` when replacing another auth provider or custom auth.
- `auth0-security-review` when auditing existing code.

## Plan Before Editing

Show the user:

- App type detected.
- Auth0 application type needed.
- Values required from Auth0.
- Files to edit.
- Package installs needed.
- Tenant changes needed, if any.

Ask before changing tenant resources or running installs.

## Safe Defaults

- Prefer Universal Login over embedded credential collection.
- Use Authorization Code with PKCE for browser and native clients.
- Use server-side sessions for server-rendered web apps.
- Use JWT bearer validation for APIs.
- Store secrets server-side only.
- Keep public client IDs and domains in public runtime config, but keep client secrets out of browser bundles.
- Add environment examples with placeholders, not real secrets.

## Verify

Prefer local compile, lint, or framework tests first. Do not run a live login flow or Auth0 CLI command unless the user approves and credentials are configured.
