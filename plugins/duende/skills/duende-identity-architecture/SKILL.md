---
name: duende-identity-architecture
description: Plan or review Duende IdentityServer and ASP.NET Core identity architecture. Use for high-level design, threat modeling, client and API boundaries, license-sensitive feature choices, and deciding which Duende or ASP.NET Core skill to use next.
---

# Duende Identity Architecture

Use this skill when the user is designing or reviewing an identity system that involves Duende IdentityServer, OAuth, OpenID Connect, Duende BFF, ASP.NET Core authentication, API protection, or token lifecycle work.

## Safety Gate

Before giving concrete code or configuration changes, confirm the relevant Duende product/version and whether the change affects production. Ask before mutating secrets, keys, issuer settings, client registrations, redirect URIs, database schemas, or production identity configuration. For version-specific APIs, licensing, and edition requirements, tell the user to verify against current Duende documentation.

## First Response

Start by classifying the request:

- New IdentityServer host or configuration: use `duende-identityserver-configuration`.
- OAuth or OIDC protocol debugging: use `duende-oauth-oidc-protocols`.
- ASP.NET Core web app or API auth middleware: use `duende-aspnetcore-auth`.
- SPA security or tokens in browsers: use `duende-bff-token-management`.
- API token validation, DPoP, mTLS, PAR, JAR, or FAPI: use `duende-api-token-security`.
- Production deployment, keys, logging, or hardening: use `duende-deployment-hardening`.
- IdentityServer4 or major Duende upgrade: use `duende-migration-upgrade`.
- SAML, dynamic client registration, or enterprise stores: use `duende-enterprise-features`.

If the request is broad, ask for the application shape, client types, API boundaries, hosting model, and current Duende or ASP.NET Core versions before recommending concrete changes.

## Architecture Defaults

- Authorization Code with PKCE is the default interactive flow.
- Avoid implicit flow for new applications.
- Prefer Duende BFF for browser SPAs that call protected APIs, so access and refresh tokens stay server-side.
- APIs validate access tokens. Clients use ID tokens for sign-in. Do not use access tokens as user identity.
- Model API boundaries explicitly with audiences, resources, and scopes.
- Treat scopes as client permissions, not a complete user authorization model.
- Use policy-based authorization in ASP.NET Core and fail closed by default.
- Prefer automatic signing key rotation in production unless the deployment has a deliberate key-management reason not to.
- Preserve issuer continuity during migrations unless there is an intentional trust reset plan.

## Trust Boundaries

Before proposing implementation changes, identify:

- Public clients, confidential clients, SPAs, native apps, machine-to-machine clients, and backend services.
- Which component stores cookies, access tokens, refresh tokens, client secrets, signing keys, and data protection keys.
- Which domains host the IdentityServer, BFF, frontend, and APIs.
- Whether the app is behind a reverse proxy or load balancer.
- Which databases or stores hold clients, grants, sessions, keys, users, and service providers.

Do not recommend persisting secrets, editing production config, rotating keys, changing issuers, changing redirect URIs, or running database migrations without an explicit user request and a rollback plan.

## Security Review Checklist

For reviews, look for:

- Broad redirect URI wildcards, insecure loopback assumptions, or mismatched callback paths.
- Missing PKCE for interactive clients.
- Browser-exposed access or refresh tokens.
- Excessive token lifetimes or reusable refresh tokens without rotation.
- Missing audience validation on APIs.
- Missing issuer validation, lax HTTPS requirements, or disabled token validation checks.
- Overbroad scopes, mixed user and client authorization, or role-only authorization.
- In-memory stores used in production for clients, grants, sessions, or keys.
- Missing forwarded header configuration behind proxies.
- Data protection keys stored ephemerally in multi-instance deployments.

When risk is high, return a prioritized review with concrete file references and small safe next steps.
