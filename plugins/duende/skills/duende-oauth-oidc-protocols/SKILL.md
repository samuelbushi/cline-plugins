---
name: duende-oauth-oidc-protocols
description: Explain, debug, or review OAuth 2.0 and OpenID Connect flows, PKCE, discovery, JWKS, token exchange, token introspection, refresh tokens, and protocol-level failures.
---

# OAuth and OIDC Protocols

Use this skill for protocol-level OAuth 2.0 and OpenID Connect work: choosing flows, debugging authorize or token requests, reading discovery documents, validating JWTs, handling JWKS rotation, introspection, refresh tokens, revocation, and claim semantics.

## Safety Gate

Before giving concrete code or configuration changes, confirm the relevant Duende product/version and whether the change affects production. Ask before mutating secrets, keys, issuer settings, client registrations, redirect URIs, database schemas, or production identity configuration. For version-specific APIs, licensing, and edition requirements, tell the user to verify against current Duende documentation.

## Core Model

- OAuth authorizes access to APIs.
- OpenID Connect adds authentication and ID tokens.
- The client consumes the ID token to sign in the user.
- The API consumes the access token to authorize API calls.
- The refresh token is a long-lived credential and needs secure server-side storage.
- The discovery document is the source of truth for endpoints and signing keys.

Do not let clients infer user identity from access tokens. Do not send ID tokens to APIs as authorization credentials.

## Flow Selection

Use authorization code with PKCE for interactive users. Use client credentials for service-to-service calls. Use device flow only for devices or CLIs where browser redirect handling is not practical. Avoid implicit flow for new systems.

When a flow is failing, collect:

- Client type and grant type.
- Authority, issuer, redirect URI, and callback path.
- Requested scopes and response type.
- Whether PKCE is enabled.
- Token endpoint error code and description.
- Browser redirect URL, excluding sensitive values.
- Relevant server logs, excluding secrets.

## Debugging Checklist

Authorize failures:

- Redirect URI mismatch.
- Missing or incorrect response type.
- Missing PKCE challenge for a client that requires PKCE.
- User blocked by consent, login, or external provider behavior.
- Scope not allowed for the client.

Token exchange failures:

- Code already used or expired.
- PKCE verifier mismatch.
- Client authentication failure.
- Wrong token endpoint or authority.
- Clock skew or proxy-host mismatch.

API failures:

- Audience mismatch.
- Issuer mismatch.
- Wrong token type.
- Missing scope or permission.
- JWKS cache is stale after key rotation.
- API is using the ID token instead of the access token.

## Refresh Tokens

Refresh tokens should be stored server-side for web apps and BFFs. Prefer rotation and reuse detection where supported by the client type. For SPAs, challenge whether refresh tokens should be in the browser at all.

Before changing refresh token settings, ask:

- Is this a public or confidential client?
- Where is the refresh token stored?
- Is reuse detection enabled?
- What is the desired user session lifetime?
- What happens on compromise or device loss?

## Protocol Output

For troubleshooting, produce:

- Observed failure.
- Protocol step that failed.
- Most likely cause.
- Minimal next diagnostic.
- Safe fix.

Avoid dumping full tokens. If claims matter, ask for decoded headers and claims with secrets and signatures omitted.
