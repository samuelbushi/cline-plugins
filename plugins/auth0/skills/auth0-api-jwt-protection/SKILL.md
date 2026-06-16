---
name: auth0-api-jwt-protection
description: Use when securing backend API endpoints with Auth0 JWT bearer token validation, audiences, issuers, scopes, permissions, RBAC, custom claims, or DPoP checks.
---

# Auth0 API JWT Protection

Use this skill for stateless APIs that receive Auth0 access tokens from clients.

## Discover

Identify:

- API framework and language.
- Existing middleware chain.
- Auth0 issuer domain.
- API audience.
- Scope or permission model.
- Routes that should be public versus protected.
- Whether machine-to-machine clients or user tokens will call the API.

## Implementation Shape

- Ask before installing packages or changing Auth0 tenant settings.
- Install the framework JWT validation middleware or SDK.
- Validate issuer and audience.
- Fetch and cache JWKS through the SDK or middleware.
- Reject expired, malformed, wrong-audience, or wrong-issuer tokens.
- Add route-level checks for scopes or permissions where needed.
- Keep authorization decisions server-side.
- Return clear 401 and 403 responses.

## Framework Hints

- Express and Node APIs: use the Auth0 JWT bearer middleware for Express when applicable.
- Fastify, FastAPI, Flask, ASP.NET Core, Spring Boot, Go, PHP, and Laravel: use the framework-specific JWT validation package or middleware.
- Server-rendered apps with login sessions should use `auth0-webapp-integration`.

## Safety

- Do not trust decoded JWT payloads without signature, issuer, and audience validation.
- Do not accept ID tokens as API access tokens.
- Do not hardcode secrets in middleware.
- Do not disable signature or expiration checks for convenience.
- Be explicit about public routes.

## Verification

Prefer unit or integration tests with generated test tokens or framework mocks. Ask before calling a real Auth0 tenant or running live token flows.
