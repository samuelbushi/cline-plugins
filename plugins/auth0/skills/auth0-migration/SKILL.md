---
name: auth0-migration
description: Use when migrating authentication to Auth0 from Firebase, Cognito, Supabase, Clerk, custom username/password auth, custom JWTs, or another identity provider.
---

# Auth0 Migration

Use this skill when the user wants to replace or gradually move existing authentication to Auth0.

## Discover

Map the current system:

- Identity provider or custom auth code.
- User database and password hash format.
- Login methods.
- Session or token shape.
- User IDs used by application data.
- Roles, permissions, teams, organizations, and tenant model.
- MFA and social login requirements.
- Downtime tolerance.

## Strategy Options

Choose one:

- Bulk import users into Auth0.
- Just-in-time migration during first login.
- Federation to an existing identity provider.
- Parallel run with feature flags.
- API-only migration where existing frontend keeps working while backend JWT validation changes.

Explain tradeoffs before editing code.

## Implementation Areas

- Auth0 connection or database setup.
- User profile mapping.
- Password migration or reset plan.
- Application callback/logout URLs.
- Token validation changes in APIs.
- Session migration for web apps.
- Role and permission mapping.
- Rollback plan.

## Safety

- Do not export, print, or commit user data.
- Do not weaken password hashing or token validation.
- Preserve stable user identifiers where the app depends on them, or provide an explicit mapping plan.
- Treat production migration as a staged rollout.
- Ask before running imports, deletes, or tenant changes.

## Verification

Use a test tenant and test users first. Verify login, logout, token validation, roles, permissions, and account linking behavior before touching production.
