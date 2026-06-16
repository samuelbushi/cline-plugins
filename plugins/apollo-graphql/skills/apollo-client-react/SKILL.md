---
name: apollo-client-react
description: Build and maintain React applications using Apollo Client, including queries, mutations, fragments, caching, local state, Suspense, TypeScript codegen, and framework integration.
---

# Apollo Client React

Use this skill for React applications that use Apollo Client.

## Workflow

1. Identify the Apollo Client version, React framework, routing model, and codegen setup before editing.
2. Inspect existing client setup, link chain, cache policies, generated types, and operation conventions.
3. Prefer current React hooks and typed operations. Avoid legacy HOC, render-prop, or untyped patterns unless the project already standardizes on them.
4. Keep GraphQL operations close to the project convention: colocated documents, generated hooks, persisted operations, or a central operations folder.
5. Handle both GraphQL errors and network errors. Do not assume `data` and `error` are mutually exclusive.
6. Update cache behavior deliberately: type policies, field policies, cache redirects, optimistic responses, or explicit refetches.
7. Add tests around loading, partial data, error states, cache updates, and mutation side effects when the code path is user-facing.

## Good Defaults

- Use fragments for repeated object selections.
- Keep query variables explicit and typed.
- Use `skipToken`, conditional variables, or framework routing state instead of firing invalid queries.
- Use optimistic updates only when rollback behavior is acceptable.
- Prefer generated types over hand-written result shapes.

## Guardrails

- Do not hide GraphQL errors behind generic fallback UI.
- Do not fetch broad objects when the component only needs a few fields.
- Do not introduce global cache policy changes without checking other screens.
- Do not commit API keys, auth headers, schema dumps with secrets, or private response fixtures.
