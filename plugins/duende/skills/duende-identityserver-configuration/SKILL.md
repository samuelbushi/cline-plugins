---
name: duende-identityserver-configuration
description: Configure or review Duende IdentityServer hosts, clients, resources, scopes, stores, signing credentials, server-side sessions, and key management.
---

# Duende IdentityServer Configuration

Use this skill for IdentityServer setup, client definitions, API resources and scopes, identity resources, signing keys, server-side sessions, and persistence stores.

## Safety Gate

Before giving concrete code or configuration changes, confirm the relevant Duende product/version and whether the change affects production. Ask before mutating secrets, keys, issuer settings, client registrations, redirect URIs, database schemas, or production identity configuration. For version-specific APIs, licensing, and edition requirements, tell the user to verify against current Duende documentation.

## Configuration Model

Anchor the work around these objects:

- Clients: applications that request tokens.
- Identity resources: user identity data available through OIDC scopes such as `openid`, `profile`, or `email`.
- API scopes: permissions a client can request for an API.
- API resources: API boundaries and audiences that receive access tokens.
- Persisted grants: authorization codes, refresh tokens, device codes, consent, and other operational data.
- Signing keys: keys used to sign tokens and discovery metadata.

If the user asks for a config change, identify which object owns the behavior before editing code.

## Client Defaults

Interactive web apps:

- Use authorization code flow with PKCE.
- Use exact redirect URIs and post-logout redirect URIs.
- Store client secrets only server-side.
- Request only needed scopes.
- Use refresh tokens only when the app has a secure server-side storage story.

Machine-to-machine clients:

- Use client credentials.
- Keep scopes narrow and API-specific.
- Prefer stronger client authentication such as private key JWT or mTLS when the environment supports it.
- Rotate secrets or credentials on a schedule.

Browser SPAs:

- Prefer Duende BFF instead of storing access or refresh tokens in browser storage.
- If a pure SPA flow is unavoidable, make the token lifetime and storage risk explicit.

## Resources and Scopes

Use API resources when the API needs a distinct audience or when multiple scopes belong to the same API boundary. Use API scopes for fine-grained permission naming.

Common review questions:

- Does each API validate the audience it expects?
- Are scopes specific enough to avoid granting unrelated access?
- Are user permissions checked separately from client scopes?
- Are identity scopes limited to claims the client genuinely needs?

## Persistence

In-memory stores are acceptable for samples, demos, and tests. For production, prefer persistent stores for:

- Clients and resources.
- Persisted grants.
- Server-side sessions.
- Signing keys or key metadata.
- Operational data needed across restarts or multiple instances.

Before adding EF Core migrations, ask which database provider is used and whether existing operational data must be preserved.

## Key Management

Prefer automatic key management in production when available for the project version and license. Review:

- Signing key storage location.
- Rotation interval and retention window.
- Whether old tokens must continue validating during rollover.
- Backup and restore process.
- Multi-instance coordination.

Do not replace or delete production signing keys without an explicit rollout plan.

## Output Style

When giving configuration guidance, include:

- The IdentityServer object being changed.
- The security reason for the change.
- The migration or rollout risk.
- A minimal code or configuration diff when enough context is available.
