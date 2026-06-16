# auth0

Skills for adding and reviewing Auth0 authentication and authorization in application code.

## What It Adds

- `auth0-quickstart` for detecting the project shape and choosing the right Auth0 integration path.
- `auth0-spa-integration` for browser SPAs such as React, Vue, Angular, and vanilla JavaScript.
- `auth0-webapp-integration` for server-rendered web apps that need login sessions.
- `auth0-api-jwt-protection` for APIs that validate Auth0 JWT access tokens.
- `auth0-mobile-native-integration` for mobile, desktop, and hybrid native flows.
- `auth0-tenant-operations` for CLI-oriented tenant setup, MFA, branding, custom domains, and Universal Login work.
- `auth0-migration` for moving existing auth from another provider or custom auth to Auth0.
- `auth0-security-review` for reviewing callback URLs, token handling, authorization checks, tenant settings, and auth regressions.

## Install

```bash
cline plugin install auth0
```

For local development from this repository:

```bash
cline plugin install ./plugins/auth0 --cwd .
```

## Example Usage

After installation, ask Cline:

```text
Add Auth0 login to this app and protect the API route that returns account data.
```

or:

```text
Review this Auth0 integration for callback URL, token storage, and API authorization issues.
```

## Requirements

- An Auth0 tenant for real configuration work.
- Auth0 application or API values such as domain, client ID, audience, callback URL, and logout URL.
- Framework package managers such as npm, pnpm, pip, dotnet, Gradle, Swift Package Manager, or Flutter only when modifying that kind of project.
- Auth0 CLI only when the user wants Cline to create or modify tenant resources from the terminal.

## Trust Boundaries

The plugin itself only installs skills. The skills may guide Cline to edit application code, write environment examples, run package installs, use the Auth0 CLI, or call the Auth0 Management API as part of a user-requested task. They require confirmation before changing tenant resources, writing callback/logout URLs, enabling MFA policies, changing custom domains, installing packages, or running live auth flows. Secrets should stay in environment files or secret managers and should not be printed, committed, or hardcoded.
