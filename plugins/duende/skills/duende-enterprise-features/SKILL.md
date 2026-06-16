---
name: duende-enterprise-features
description: Work with Duende enterprise and advanced IdentityServer features such as SAML service providers, dynamic client registration, custom stores, user management integration, Aspire hosting, and session providers.
---

# Duende Enterprise Features

Use this skill when the user asks about SAML, dynamic client registration, custom stores, server-side session providers, user management integration, Aspire hosting, or other advanced Duende features that often depend on version, product edition, or deployment architecture.

## Safety Gate

Before giving concrete code or configuration changes, confirm the relevant Duende product/version and whether the change affects production. Ask before mutating secrets, keys, issuer settings, client registrations, redirect URIs, database schemas, or production identity configuration. For version-specific APIs, licensing, and edition requirements, tell the user to verify against current Duende documentation.

## Version and License Gate

Before recommending implementation details, ask the user to confirm:

- Duende product and version.
- License edition or entitlement for the feature.
- Hosting model.
- Store provider.
- Existing client, service provider, or user data model.
- Whether the feature is for production or a prototype.

If the answer depends on current Duende licensing or version behavior, tell the user to verify against current Duende docs before implementation.

## SAML

For SAML identity provider work, review:

- Service provider entity ID.
- Assertion consumer service URLs.
- Single logout URLs.
- Signing and encryption requirements.
- NameID format.
- Claim to attribute mappings.
- IdP-initiated versus SP-initiated flows.
- Metadata publication.
- Multi-tenant issuer behavior.

SAML integrations are interoperability-sensitive. Prefer exact service provider metadata over hand-written values when available.

## Dynamic Client Registration

For DCR, clarify:

- Who is allowed to register clients.
- How the DCR endpoint is authenticated and authorized.
- Which client properties are allowed.
- Whether registrations require approval.
- How secrets or credentials are issued and rotated.
- How abuse is detected and audited.

Do not expose unauthenticated registration endpoints unless the user has an explicit, documented policy for that risk.

## Stores and User Management

For custom or EF stores, identify:

- Configuration store.
- Operational store.
- User store.
- Server-side session store.
- SAML service provider store.
- Key store.

Keep store concerns separate. Avoid coupling user profile data to client configuration or persisted grants unless the app already has that architecture.

## Aspire and Local Hosting

For Aspire or local orchestration guidance, focus on repeatable developer environments:

- Stable authority URL.
- HTTPS certificates.
- Database containers and migrations.
- Seed clients and resources.
- Service discovery for APIs.
- Clear separation from production secrets.

## Output Style

Give a concise design or review with:

- Feature gate and assumptions.
- Required configuration objects.
- Storage model.
- Security controls.
- Test cases.
