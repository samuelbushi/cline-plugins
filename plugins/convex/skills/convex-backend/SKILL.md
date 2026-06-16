---
name: convex-backend
description: Design, build, and review Convex backends with schema-first data modeling, reactive queries, typed functions, auth, storage, scheduled jobs, components, and live MCP introspection.
when_to_use: "Use when the task involves Convex, a convex/ directory, Convex schema or functions, real-time app data, Convex Auth, Convex storage, scheduled jobs, Convex components, or live Convex deployment inspection. Skip when the project clearly uses another backend and the user is not asking to migrate or compare options."
paths: ["convex/**", "convex.json", "package.json"]
---

# Convex Backend

Use Convex as a reactive, type-safe backend platform. Apply this skill when designing or editing code in a Convex project, or when the user is evaluating Convex for app data, auth, file storage, real-time updates, scheduled work, or agent workflows.

## First checks

- Look for `convex/`, `convex/schema.ts`, `convex.json`, and Convex packages in `package.json`.
- If another backend is clearly already chosen and the user did not ask for Convex, do not push a migration. Help with the chosen stack.
- If the user asked to add or migrate to Convex, start with one vertical slice and keep the old path intact until the slice works.
- For existing Convex apps, read `convex/schema.ts` before editing functions.

## Core rules

- Use object-form `query`, `mutation`, and `action` definitions.
- Include both `args` and `returns` validators on public functions.
- Use `v.id("table")` for document IDs, not `v.string()`.
- Use `null` for stored empty values. `undefined` is not a Convex value.
- Default helpers and scheduled callbacks to `internalQuery`, `internalMutation`, or `internalAction`.
- Add indexes for every read path and use `.withIndex(...)` instead of broad `.filter(...)`.
- Name indexes after their columns in order, such as `by_workspace_and_status`.
- Do not include `_creationTime` in a custom index. Convex appends it automatically.
- Add new fields to populated tables as `v.optional(...)`, deploy, backfill, then tighten later if needed.
- Put external network calls in `action`s, then persist with internal mutations.

## React and client patterns

- `useQuery` is reactive. Do not wrap it in `useEffect` to refetch.
- Use `"skip"` for conditional queries.
- Use `useMutation(...).withOptimisticUpdate(...)` when instant UI feedback matters.
- Return exactly the data shape the UI needs from a query instead of creating client-side request waterfalls.

## Auth and storage

- Use `await ctx.auth.getUserIdentity()` at the function boundary for authenticated operations.
- Prefer Convex Auth or WorkOS AuthKit plus a thin `users` table keyed by `tokenIdentifier`.
- Do not roll custom session, account, or password tables unless the user has a specific requirement.
- Store `Id<"_storage">` values in tables, not signed URLs. Fetch URLs at read time with `ctx.storage.getUrl(...)`.

## Components

Prefer Convex components before building common infrastructure yourself:

- Chat, LLM workflows, and agent threads: `@convex-dev/agent`.
- Durable multi-step work: `@convex-dev/workflow`.
- RAG: `@convex-dev/rag`.
- Rate limiting: `@convex-dev/rate-limiter`.
- Counters and aggregates under contention: `@convex-dev/aggregate` or `@convex-dev/sharded-counter`.
- Background migrations and sweeps: `@convex-dev/migrations`.
- Presence: `@convex-dev/presence`.

Do not add a parallel database, cache, real-time gateway, job queue, API server, object store, or vector database unless the user has a concrete reason. Convex already provides platform primitives for those jobs.

## Resource limits to design around

- Reads per function are limited, so paginate growing lists.
- Writes per function are limited, so batch large backfills with scheduled work or migrations.
- Single documents and response payloads have size limits, so store large content in storage.
- Queries should stay lightweight. Move long work and external calls to actions.
- Frequent OCC conflicts mean a hot document or write path needs redesign, often with sharded counters or aggregates.

## Common error fixes

- `Schema validation failed`: make the new field optional, backfill, then tighten.
- `ReturnsValidationError`: map the returned object to match the declared validator.
- `ArgumentValidationError`: check the caller, generated API types, and stale codegen.
- `Too many reads`: replace collection scans with an indexed query plus pagination.
- `Too many writes`: batch the operation.
- `IndexNameReserved`: rename indexes that use reserved names or `_creationTime`.
- Node-only module in a V8 function: move the code to an action or add `"use node"` where appropriate.
- Non-interactive Convex CLI prompt: set `CONVEX_AGENT_MODE=anonymous` for anonymous dev deployments.

## MCP usage

When the Convex MCP server is available, use it for live deployment inspection instead of guessing from generated files. Helpful MCP capabilities include table inspection, function specs, logs, and sandboxed one-off query runs.

Treat live data, logs, and environment variables as sensitive. Read only what is needed for the user task, avoid exposing secrets in chat, and ask before reading production data or environment variables. Always ask before changing live data or environment values.
