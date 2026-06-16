---
name: duende-api-token-security
description: Review or implement API protection and advanced token security with JWTs, reference tokens, introspection, DPoP, mTLS, PAR, JAR, FAPI-style controls, token lifetimes, and revocation.
---

# API and Token Security

Use this skill for protected APIs, access token validation, token format decisions, token lifetime review, reference tokens, introspection, sender-constrained tokens, DPoP, mTLS, pushed authorization requests, signed authorization requests, and high-assurance OAuth deployments.

## Safety Gate

Before giving concrete code or configuration changes, confirm the relevant Duende product/version and whether the change affects production. Ask before mutating secrets, keys, issuer settings, client registrations, redirect URIs, database schemas, or production identity configuration. For version-specific APIs, licensing, and edition requirements, tell the user to verify against current Duende documentation.

## API Protection Baseline

Every protected API should validate:

- Issuer.
- Audience.
- Token signature or introspection result.
- Expiration.
- Token type where relevant.
- Required client scope.
- Required user permission or resource rule when user context matters.

Scopes are not a complete user authorization system. Combine scope checks with policy or resource authorization when the user can access only some resources.

## JWT vs Reference Tokens

JWT access tokens:

- Useful for low-latency local validation.
- Require key rollover handling.
- Cannot be revoked instantly unless APIs check revocation separately.

Reference tokens:

- Require introspection.
- Support server-side lookup and revocation.
- Add latency and availability dependency on the authorization server.

Choose based on revocation needs, API topology, latency, and operational tolerance.

## Sender-Constrained Tokens

Use DPoP or mTLS when bearer token replay risk is unacceptable.

DPoP:

- Application-layer proof.
- Useful where client certificates are hard to deploy.
- Requires proof validation and replay controls.

mTLS:

- TLS-layer certificate binding.
- Strong fit where certificate infrastructure already exists.
- More operationally heavy.

Before recommending either, ask which clients need it, where keys live, whether the API can validate the proof, and whether the deployment has the required infrastructure and license.

## PAR, JAR, and High Assurance

Pushed authorization requests reduce front-channel parameter exposure. Signed authorization requests protect request integrity. Use these controls when the app has regulatory, financial, healthcare, government, or high-risk requirements.

Do not add these features casually to a simple app without explaining operational cost and client compatibility impact.

## Token Lifetime Review

Review:

- Access token lifetime.
- Refresh token lifetime.
- Refresh token rotation.
- Reuse detection behavior.
- Revocation path.
- User session lifetime.
- Consent and reauthentication requirements.

Shorter is not always better if it causes unsafe refresh handling. Tie lifetimes to storage risk and user experience.

## Output Style

For security reviews, separate:

- Immediate vulnerabilities.
- Defense-in-depth improvements.
- Operational tradeoffs.
- Version or license checks the user must verify in current Duende docs.
