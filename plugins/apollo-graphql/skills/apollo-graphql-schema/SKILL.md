---
name: apollo-graphql-schema
description: Design GraphQL schemas with Apollo-friendly patterns for types, fields, nullability, pagination, errors, authorization boundaries, naming, and evolution.
---

# Apollo GraphQL Schema

Use this skill for GraphQL schema design and review.

## Workflow

1. Understand the product use case, clients, data ownership, and API evolution constraints.
2. Model domain concepts instead of database tables or raw service payloads.
3. Choose field names, type names, descriptions, and nullability deliberately.
4. Use pagination for lists that can grow.
5. Put authorization and privacy boundaries into the schema review, not only resolver code.
6. Check existing schema style before introducing new conventions.
7. Plan breaking changes with deprecation, client usage checks, and rollout steps.

## Design Guidance

- Use object types for meaningful domain entities.
- Use enums for stable, finite values.
- Prefer nullable fields when source data can genuinely be missing.
- Use connection-style pagination or an existing project pagination convention.
- Keep mutations task-oriented and explicit.
- Add descriptions for public or cross-team schema fields.

## Guardrails

- Do not expose internal-only identifiers or operational fields without confirming the boundary.
- Do not change nullability from nullable to non-null unless data guarantees prove it is safe.
- Do not remove or rename fields without a migration plan.
