---
name: apollo-rover
description: Use Apollo Rover CLI for GraphOS and federation workflows, including schema checks, graph publishing, subgraph introspection, local supergraph composition, and contract-aware changes.
---

# Apollo Rover

Use this skill when the user asks for Rover CLI, GraphOS, schema check, publish, or local supergraph work.

## Workflow

1. Check whether Rover is already installed and whether the project has scripts for Rover commands.
2. Identify graph refs, variants, subgraph names, schema file paths, and environment variables from the project.
3. Prefer existing package scripts or CI commands over inventing new command shapes.
4. For checks, run or propose the smallest relevant Rover command.
5. For publishing, require explicit user confirmation and explain the target graph, variant, and subgraph.
6. For local supergraph work, compose locally before suggesting deployment changes.

## Common Tasks

- Run schema checks before merging.
- Publish a subgraph schema.
- Introspect a running subgraph.
- Compose a local supergraph.
- Inspect graph or subgraph configuration.
- Debug composition and contract errors.

## Guardrails

- Never print or commit `APOLLO_KEY`.
- Do not publish schemas or modify GraphOS state without explicit confirmation.
- Do not guess graph refs. Read them from config, CI, environment examples, or ask the user.
