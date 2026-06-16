---
name: duende-deployment-hardening
description: Prepare or review Duende IdentityServer and BFF production deployments, including reverse proxies, forwarded headers, data protection, signing keys, health checks, logging, OpenTelemetry, multi-instance state, and security hardening.
---

# Duende Deployment and Hardening

Use this skill for production readiness, security hardening, reverse proxy behavior, data protection, signing keys, health checks, logging, distributed state, multi-instance deployment, and operational troubleshooting.

## Safety Gate

Before giving concrete code or configuration changes, confirm the relevant Duende product/version and whether the change affects production. Ask before mutating secrets, keys, issuer settings, client registrations, redirect URIs, database schemas, or production identity configuration. For version-specific APIs, licensing, and edition requirements, tell the user to verify against current Duende documentation.

## Production Checklist

Review:

- HTTPS at the external boundary.
- Forwarded headers configured before auth middleware when behind a proxy.
- Stable issuer and public origin.
- Secure cookie settings.
- Persistent ASP.NET Core Data Protection keys.
- Durable signing key storage or automatic key management.
- Persistent grants and server-side sessions stored outside process memory.
- Health checks that do not expose sensitive details.
- Structured auth events and logs.
- Alerting for token, key, login, logout, grant, and external provider failures.

## Reverse Proxies

Proxy misconfiguration often causes:

- HTTP issuer in discovery metadata.
- Wrong redirect URI.
- Cookies missing Secure behavior.
- SameSite failures after login.
- Callback or logout loops.

Check:

- `X-Forwarded-Proto` and `X-Forwarded-Host`.
- Known proxies or networks.
- Middleware order.
- Public origin configuration.
- Whether the proxy strips or rewrites paths.

## Data Protection

Data Protection keys protect cookies and other sensitive ASP.NET Core payloads. In production:

- Persist keys to a shared durable store.
- Protect keys at rest.
- Use a stable application discriminator across instances.
- Back up keys.
- Never rely on ephemeral per-instance keys for a scaled service.

Distinguish Data Protection keys from IdentityServer signing keys. They solve different problems.

## Signing Keys

Before changing signing keys, ask:

- How tokens are validated by APIs.
- Current key ids and rollover policy.
- Token lifetimes that require old keys to remain available.
- Backup and restore requirements.
- Multi-instance coordination.

Do not delete old signing keys until all tokens signed by them are expired and downstream APIs have refreshed metadata.

## Observability

Recommend logs and traces that help answer:

- Which client failed?
- Which endpoint failed?
- Which scheme handled the request?
- Was the user authenticated?
- Did authorization fail due to scope, policy, audience, or claim?
- Was key discovery or token introspection unavailable?

Avoid logging tokens, secrets, authorization codes, cookies, or personally sensitive claim values unless the user has an explicit redaction plan.

## Safe Rollout

For production changes, propose:

- Non-production validation.
- Backward-compatible deployment steps.
- Rollback plan.
- Monitoring during rollout.
- Concrete checks after rollout.
