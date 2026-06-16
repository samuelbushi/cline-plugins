---
name: auth0-webapp-integration
description: Use when adding Auth0 login, logout, callback handling, user sessions, protected pages, or server-side route protection to server-rendered web applications.
---

# Auth0 Web App Integration

Use this skill for apps where the server owns the login callback and session.

## Discover

Identify:

- Framework and router.
- Session or cookie mechanism.
- Existing auth middleware.
- Auth0 domain, client ID, and client secret.
- Callback URL and logout URL.
- Whether organizations, roles, permissions, or custom claims are required.

## Implementation Shape

- Ask before installing packages or changing Auth0 tenant settings.
- Install the framework SDK or OIDC middleware.
- Configure domain, client ID, client secret, issuer base URL, and app base URL through environment variables.
- Add login, callback, logout, and profile routes if the SDK does not provide them.
- Protect pages or routes with server middleware.
- Read the authenticated user from the session helper provided by the SDK.
- Keep session cookies secure, HTTP-only, and same-site where the framework supports it.

## Framework Hints

- Next.js: use the current Next.js Auth0 SDK pattern for the router in the project.
- Express: use session-based OpenID Connect middleware for web apps.
- Flask, Laravel, PHP, ASP.NET Core, Spring Boot, and Java MVC: use the official framework package or OIDC middleware pattern already present in the project.
- If the project is an API without browser sessions, use `auth0-api-jwt-protection`.

## Confirmation Gate

Before applying tenant changes, show:

- Callback URLs.
- Logout URLs.
- Allowed web origins if needed.
- Application type.
- Secret names to create or update.

## Verification

Run build, typecheck, or framework tests. Ask before running a live browser login flow or changing tenant application settings.
