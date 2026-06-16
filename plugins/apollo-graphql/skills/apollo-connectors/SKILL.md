---
name: apollo-connectors
description: Build Apollo Connectors schemas that integrate REST or HTTP APIs into GraphQL, including sources, connect directives, selection mapping, variables, entities, batching, and validation.
---

# Apollo Connectors

Use this skill when the user wants to connect REST or HTTP APIs to a GraphQL schema with Apollo Connectors.

## Workflow

1. Inspect the target REST API, auth model, base URL, request methods, response shapes, pagination, and error behavior.
2. Design GraphQL types first. Keep the graph shape user-oriented rather than mirroring raw REST payloads blindly.
3. Define source configuration, headers, and environment-driven secrets without hardcoding sensitive values.
4. Add `@connect` mappings with clear variable usage from arguments, parent objects, context, or config.
5. Use entity patterns and keys when the connected data participates in a federated graph.
6. Validate connector schemas and fix mapping or composition errors before editing unrelated code.

## Mapping Guidance

- Keep selections narrow and stable.
- Normalize field names into GraphQL conventions.
- Handle optional response fields with realistic nullability.
- Use batching only when the source API and graph access pattern justify it.
- Keep pagination explicit.

## Guardrails

- Do not commit API tokens, bearer headers, or private sample payloads.
- Do not expose raw source API error bodies if they can contain secrets.
- Do not design connectors that allow arbitrary URL or method selection from GraphQL arguments.
