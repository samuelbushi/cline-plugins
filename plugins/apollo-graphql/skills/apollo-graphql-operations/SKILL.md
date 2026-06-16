---
name: apollo-graphql-operations
description: Write GraphQL queries, mutations, subscriptions, fragments, and variables with Apollo-friendly operation structure, type generation, cache behavior, and error handling.
---

# Apollo GraphQL Operations

Use this skill for GraphQL operation authoring and review.

## Workflow

1. Find existing operation style, naming conventions, fragment patterns, and code generation.
2. Select only fields required by the UI or workflow.
3. Use variables for dynamic values. Avoid string-building GraphQL.
4. Reuse fragments when they match a real component or domain boundary.
5. Check cache identity and mutation update behavior for Apollo Client users.
6. Include operation tests, generated type updates, or fixture updates when the project uses them.

## Operation Guidance

- Name every operation.
- Keep fragments cohesive and avoid all-purpose mega-fragments.
- Prefer typed variables over inline literals.
- Handle partial data and GraphQL errors explicitly.
- Keep subscription payloads small and stable.
- Consider persisted operations for production clients.

## Guardrails

- Do not add fields just because they are available.
- Do not request secrets, tokens, or private admin-only fields unless the user confirms the need.
- Do not bypass existing generated-type or persisted-operation workflows.
