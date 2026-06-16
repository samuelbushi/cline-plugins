---
name: foundry-security
description: Review Falcon Foundry apps for OAuth scopes, RBAC, credential handling, input validation, UI security, CSP, data exposure, logs, and release readiness.
when_to_use: "Use for Foundry app security reviews, OAuth scope selection, RBAC design, credential handling, input validation, XSS review, CSP review, pre-deploy review, or pre-release review."
---

# Foundry Security

Security review should happen before deployment and again before release. Keep the review practical and tied to the app's actual capabilities.

## Review checklist

- OAuth scopes are the narrowest needed for the app.
- RBAC and sharing settings match the intended users.
- API integrations use platform-managed credentials.
- Functions do not hardcode secrets or pass Falcon credentials explicitly when platform auth should apply.
- Workflows do not store secrets in YAML.
- Collections do not store raw credentials, unnecessary customer data, or unbounded sensitive payloads.
- UI code does not expose tokens, credentials, or sensitive Falcon data in client logs.
- Inputs are validated at app boundaries.
- Error messages are useful but do not leak internal details or secrets.
- CI and e2e tests use secret stores, not committed env files.

## UI security

- Avoid rendering unsanitized user or API-provided HTML.
- Use platform-safe components and conservative iframe behavior.
- Keep CSP changes narrow and justified.
- Do not use unsafe eval patterns or broad wildcard policies unless the user explicitly accepts the risk.

## Credential handling

Ask before reading or writing credential files, profile files, CI secrets, or live environment settings. Never echo secrets back to the user. If a command output includes a token or password, redact it before quoting.

## Release readiness

Before release, confirm validation, intended scopes, app metadata, screenshots, documentation, and absence of test data or secrets in the package.
