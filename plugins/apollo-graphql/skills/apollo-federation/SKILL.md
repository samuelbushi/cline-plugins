---
name: apollo-federation
description: Design and troubleshoot Apollo Federation subgraphs and supergraphs, including entities, keys, directives, composition, ownership boundaries, and field migration.
---

# Apollo Federation

Use this skill for federated GraphQL schema work.

## Workflow

1. Identify subgraph ownership, current supergraph composition status, federation version, and graph boundaries.
2. Read the relevant subgraph schemas and composition errors before proposing changes.
3. Model entities around ownership and stable identity. Choose `@key` fields that are stable and resolvable.
4. Use federation directives deliberately: `@key`, `@external`, `@requires`, `@provides`, `@shareable`, `@override`, and `@interfaceObject`.
5. Keep field migration explicit. For moved fields, plan compatibility, rollout, and rollback.
6. Run or recommend composition checks before shipping schema changes.

## Schema Guidance

- A subgraph should own fields it can resolve reliably.
- Prefer value types only when shared fields truly have the same meaning across subgraphs.
- Keep entity reference resolvers fast and batchable.
- Avoid cross-subgraph designs that require many sequential hops for common operations.
- Document ownership decisions when adding or moving fields.

## Guardrails

- Do not use `@shareable` to avoid resolving real ownership questions.
- Do not add `@provides` or `@requires` without checking query plan impact.
- Do not remove fields or change nullability without an explicit migration plan.
