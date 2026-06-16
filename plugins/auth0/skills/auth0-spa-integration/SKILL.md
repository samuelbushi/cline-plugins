---
name: auth0-spa-integration
description: Use when adding Auth0 login, logout, protected routes, token retrieval, or API calls to browser single-page apps such as React, Vue, Angular, vanilla JavaScript, Svelte, or Solid.
---

# Auth0 SPA Integration

Use this skill for browser-only apps that authenticate users with redirects and call APIs with access tokens.

## Before Editing

Identify:

- Framework and router.
- Package manager.
- Current auth or state management.
- Auth0 domain and client ID.
- API audience if the SPA calls a protected API.
- Callback and logout URLs.

Ask before installing packages or changing Auth0 tenant settings.

## Implementation Shape

- Install the framework Auth0 SDK when available.
- Wrap the app with the Auth0 provider or plugin near the app root.
- Configure domain, client ID, authorization parameters, redirect URI, and audience when needed.
- Add login and logout actions.
- Add a protected route or guard.
- Use the SDK token helper for API calls.
- Keep secrets out of browser code. A SPA may contain domain, client ID, and audience, but not client secrets.

## Framework Hints

- React: use the Auth0 React provider and hooks.
- Vue: use the Auth0 Vue plugin and route guards.
- Angular: use the Auth0 Angular module, guards, and HTTP interceptor.
- Vanilla or other SPA frameworks: use the SPA JS SDK directly.
- Nuxt or Next.js with server sessions should use `auth0-webapp-integration`, not this skill.

## Files

Common files:

- App root or framework entry file.
- Router configuration.
- Environment example.
- API client helper.
- Login/logout UI component.

## Verification

Run build or typecheck first. A live login test needs tenant values and browser interaction, so ask before attempting it.

## Safety

- Do not write real secrets to source files.
- Validate callback and logout URLs before asking the user to save tenant changes.
- Do not store access tokens manually in local storage unless the user explicitly accepts that tradeoff and the app already uses that pattern.
