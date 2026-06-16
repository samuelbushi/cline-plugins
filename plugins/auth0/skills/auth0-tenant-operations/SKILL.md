---
name: auth0-tenant-operations
description: Use when managing Auth0 tenant resources such as applications, APIs, organizations, users, roles, MFA, branding, Universal Login, custom domains, Actions, logs, or Auth0 CLI workflows.
---

# Auth0 Tenant Operations

Use this skill when the user wants Cline to inspect or change Auth0 tenant configuration.

## Preconditions

Before running Auth0 CLI or Management API commands:

- Confirm the target tenant and environment.
- Confirm whether this is development, staging, or production.
- Confirm the exact resource to create, update, or delete.
- Check whether the Auth0 CLI is installed and authenticated only after the user approves CLI use.
- Never print access tokens or client secrets.

## Common Workflows

- Create or update an application.
- Create or update an API audience.
- Add callback, logout, and web origin URLs.
- Enable or configure MFA factors and policies.
- Configure Universal Login branding and custom text.
- Set up or verify custom domains.
- Inspect logs for authentication failures.
- Manage roles, permissions, and organizations.

## Change Plan

Before applying changes, show:

- Tenant.
- Resource type and name.
- Exact URLs, scopes, roles, factors, or branding values.
- Whether the change affects login in production.
- Rollback path.

Wait for approval before making changes.

## Safety

- Treat tenant changes as production changes unless proven otherwise.
- Prefer read-only inspection first.
- Keep secrets in secret managers or env files.
- Avoid destructive operations without explicit confirmation.
- Export or record current settings before replacing risky configuration.

## Verification

Use read-back checks after changes. For custom domains, distinguish DNS propagation from Auth0 configuration. For MFA and login changes, ask before running live user flows.
