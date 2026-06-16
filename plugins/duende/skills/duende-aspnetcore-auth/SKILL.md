---
name: duende-aspnetcore-auth
description: Implement or review ASP.NET Core authentication and authorization with cookies, OpenID Connect, JWT bearer, schemes, policies, claims, scopes, and API endpoint protection.
---

# ASP.NET Core Authentication and Authorization

Use this skill for ASP.NET Core auth middleware, OIDC client setup, JWT bearer API protection, cookie configuration, authentication schemes, claim mapping, authorization policies, custom authorization handlers, and endpoint protection.

## Safety Gate

Before giving concrete code or configuration changes, confirm the relevant Duende product/version and whether the change affects production. Ask before mutating secrets, keys, issuer settings, client registrations, redirect URIs, database schemas, or production identity configuration. For version-specific APIs, licensing, and edition requirements, tell the user to verify against current Duende documentation.

## Authentication Defaults

Server-rendered web apps:

- Use cookie authentication for the local session.
- Use OpenID Connect as the challenge scheme.
- Use authorization code flow.
- Disable inbound claim type mapping when predictable claim names matter.
- Keep client secrets server-side.
- Use HTTPS and secure cookies in production.

APIs:

- Use JWT bearer validation or token introspection depending on token format.
- Validate issuer and audience.
- Require explicit authorization on endpoints.
- Check scopes and user permissions separately.

SPAs:

- Prefer Duende BFF so browser JavaScript does not handle access or refresh tokens.

## Scheme Review

Before editing auth setup, inspect:

- Default scheme.
- Default challenge scheme.
- Cookie scheme names.
- OIDC scheme names.
- JWT bearer scheme names.
- Any external provider schemes.

Many auth bugs are scheme bugs. If login, logout, challenge, or forbid behavior is wrong, map the scheme flow before changing options.

## Authorization Defaults

Prefer policy-based authorization over direct role checks in attributes. A good policy can combine:

- Authenticated user requirement.
- Required client scope.
- Required user claim or role.
- Resource-specific checks through `IAuthorizationService`.

Use a fallback policy when the app should fail closed by default. Confirm public endpoints are intentionally public.

## Claims

Review:

- Claim type names after mapping.
- Name and role claim type settings.
- Whether claims come from the ID token, userinfo endpoint, access token, or local database.
- Whether the API trusts claims from the correct token.
- Whether claims transformation is deterministic and testable.

Avoid building authorization on display names, emails, or mutable profile data unless the business explicitly accepts that risk.

## Common Failure Patterns

- Redirect loop caused by cookie, SameSite, proxy, or callback path issues.
- API returns 401 because the token audience does not match.
- API returns 403 because authentication succeeded but the required scope or policy failed.
- Claims appear under Microsoft claim URIs because inbound mapping was not disabled.
- Logout clears the app cookie but not the OIDC provider session.
- A fallback policy accidentally blocks static assets or health endpoints.

## Output Style

For code help, identify the app type, scheme setup, endpoints being protected, expected token, and exact failure. Provide small changes and explain why each one changes auth behavior.
