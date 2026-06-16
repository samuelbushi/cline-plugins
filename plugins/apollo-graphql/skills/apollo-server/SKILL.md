---
name: apollo-server
description: Build and maintain Apollo Server GraphQL APIs, including schemas, resolvers, context, authentication, data sources, error handling, subscriptions, plugins, and tests.
---

# Apollo Server

Use this skill for GraphQL server work with Apollo Server.

## Workflow

1. Identify the Apollo Server major version, runtime, framework integration, schema loading strategy, and deployment target.
2. Read schema definitions, resolver maps, context creation, auth middleware, data sources, plugin setup, and tests before editing.
3. Keep schema changes backwards compatible unless the user explicitly wants a breaking change.
4. Put authorization checks close to the resolver or data source boundary that owns the protected data.
5. Avoid N+1 queries with batching, caching, data loaders, or service-level bulk APIs.
6. Return useful GraphQL errors without leaking internal stack traces, secrets, tokens, or database details.
7. Update tests for schema behavior, auth decisions, error shapes, and resolver side effects.

## Resolver Guidance

- Keep resolvers thin and move business logic into services when the codebase has that pattern.
- Validate input before side effects.
- Make nullability match reality. Do not mark fields non-null if source data can be absent.
- Use context for request-scoped user, auth, tracing, and data loaders.
- Keep subscriptions bounded and authenticated.

## Guardrails

- Do not add introspection, playgrounds, or broad CORS in production without checking existing policy.
- Do not log raw tokens, cookies, authorization headers, or sensitive variables.
- Do not create schema fields that expose internal IDs or private operational data unless the user confirms the boundary.
