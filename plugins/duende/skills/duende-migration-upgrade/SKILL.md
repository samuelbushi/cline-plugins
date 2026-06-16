---
name: duende-migration-upgrade
description: Plan or review migrations from IdentityServer4 to Duende IdentityServer and major Duende upgrades, including packages, namespaces, database schema, issuer continuity, signing keys, data protection, licenses, and UI updates.
---

# Duende Migration and Upgrade

Use this skill for IdentityServer4 migrations, major Duende upgrades, database schema changes, namespace/package replacement, license planning, signing key migration, issuer continuity, and UI template updates.

## Safety Gate

Before giving concrete code or configuration changes, confirm the relevant Duende product/version and whether the change affects production. Ask before mutating secrets, keys, issuer settings, client registrations, redirect URIs, database schemas, or production identity configuration. For version-specific APIs, licensing, and edition requirements, tell the user to verify against current Duende documentation.

## First Questions

Ask for:

- Current product and version.
- Target Duende version.
- .NET target framework.
- Database provider and EF Core usage.
- In-memory, EF, or custom stores.
- Current issuer URL.
- Signing key storage.
- Data Protection key storage.
- Number and type of clients.
- Whether production tokens must remain trusted during migration.

Do not assume the current latest version. Ask the user to confirm target versions or check current official docs before version-specific work.

## Migration Invariants

- Preserve issuer unless the user intentionally wants to break trust and reconfigure every client/API.
- Preserve signing trust until existing tokens expire or clients and APIs are coordinated.
- Preserve persisted grants when users should remain signed in or refresh tokens should survive.
- Back up databases before schema changes.
- Review client inventory before choosing license edition or feature set.
- Validate third-party authentication handlers against the target ASP.NET Core version.

## IdentityServer4 to Duende

Typical work areas:

- Replace packages and namespaces.
- Update target framework and hosting model.
- Apply database migrations for configuration and operational stores.
- Configure Duende license key for production usage.
- Review changed defaults and removed APIs.
- Move from developer signing credentials to production key management.
- Update login, logout, consent, and error UI templates.

For older IdentityServer4 versions, check whether an intermediate migration is needed before moving to the target Duende version.

## Major Duende Upgrades

For major version upgrades:

- Read the official upgrade guide for each major version crossed.
- Identify package version constraints.
- Review schema migrations.
- Review product edition or license changes.
- Run integration tests for login, logout, refresh, consent, API calls, and external providers.
- Verify discovery metadata and JWKS before and after.

## Output Style

Return a migration plan in phases:

1. Inventory and backups.
2. Code and package changes.
3. Schema and data migration.
4. Identity and token trust validation.
5. Rollout and rollback.

When giving code diffs, keep them scoped to the version details the user has confirmed.
