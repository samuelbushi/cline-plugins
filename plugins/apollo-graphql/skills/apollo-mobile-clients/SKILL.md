---
name: apollo-mobile-clients
description: Build mobile GraphQL clients with Apollo iOS and Apollo Kotlin, including setup, codegen, operations, caching, custom scalars, interceptors, subscriptions, and testing.
---

# Apollo Mobile Clients

Use this skill for Apollo iOS or Apollo Kotlin work.

## Workflow

1. Identify platform, package manager, Apollo client version, generated code location, and schema or operation download workflow.
2. Inspect existing generated models and operation documents before editing.
3. Keep operations typed and version-compatible with the local Apollo client.
4. Treat custom scalars, cache keys, interceptors, and auth headers as first-class integration points.
5. Run or recommend the project codegen command after operation or schema changes.
6. Add platform tests for parsing, cache behavior, auth failure, retry, and subscription behavior where relevant.

## Platform Notes

- For iOS, check Swift package setup, generated module names, custom scalar mappings, and normalized cache usage.
- For Kotlin, check Gradle plugin setup, package names, operation output, scalar adapters, and normalized cache usage.
- For both platforms, preserve generated files according to project policy.

## Guardrails

- Do not hand-edit generated code unless the project explicitly keeps generated sources as editable fixtures.
- Do not commit mobile auth secrets, sample tokens, or private schema snapshots.
- Do not upgrade Apollo client major versions as a side effect of a feature change.
