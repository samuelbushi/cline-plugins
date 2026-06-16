---
name: duende-bff-token-management
description: Design or review Duende BFF and Duende AccessTokenManagement usage for SPAs, server-side token storage, CSRF protection, proxy endpoints, refresh tokens, and token lifecycle handling.
---

# Duende BFF and Token Management

Use this skill when a browser app calls protected APIs, when tokens are at risk of ending up in browser storage, or when the user needs Duende BFF or access token management guidance.

## Safety Gate

Before giving concrete code or configuration changes, confirm the relevant Duende product/version and whether the change affects production. Ask before mutating secrets, keys, issuer settings, client registrations, redirect URIs, database schemas, or production identity configuration. For version-specific APIs, licensing, and edition requirements, tell the user to verify against current Duende documentation.

## BFF Principle

The browser should hold an HTTP-only secure session cookie, not access tokens or refresh tokens. The BFF stores tokens server-side and proxies API calls or attaches tokens from trusted server code.

Prefer this shape for SPAs and browser-heavy apps:

- Browser signs in through the BFF.
- BFF holds the user session and tokens server-side.
- Browser calls BFF endpoints with cookies.
- BFF applies CSRF protection.
- BFF calls downstream APIs with access tokens.

## Review Checklist

Check for:

- Tokens in local storage, session storage, IndexedDB, or JavaScript-readable cookies.
- API endpoints that skip CSRF protection.
- SameSite and Secure cookie settings that conflict with the deployment domains.
- In-memory server-side sessions used in production.
- Refresh tokens stored outside a server-side store.
- Manual refresh logic that should be handled by token management.
- Direct browser calls to protected APIs that bypass the BFF.

## CSRF

BFF API endpoints need explicit CSRF protection. If the project uses Duende BFF endpoint conventions, confirm the endpoint is marked as a BFF API endpoint or remote BFF endpoint as appropriate.

Do not suggest disabling CSRF to fix a request failure. If a request fails because the CSRF header is missing, fix the frontend request shape.

## Token Management

Use automatic token management when server-side code needs to call APIs on behalf of the user or as a client. Before adding or changing token management, ask:

- User token or client token?
- Which API and scopes?
- Where are tokens cached?
- How are refresh failures handled?
- What should happen when consent or user session expires?

Never print access tokens, refresh tokens, client secrets, or cookie values in answers.

## Deployment Notes

For production BFF deployments, review:

- Reverse proxy headers and original scheme.
- Cookie domain, SameSite, Secure, and path.
- Server-side session persistence.
- Data protection key persistence.
- Horizontal scaling and cache/session affinity.
- Logout behavior across app, BFF, IdentityServer, and external providers.

## Output Style

When helping with BFF work, state the trust boundary first: what runs in the browser, what runs on the server, where tokens live, and which component calls each API.
