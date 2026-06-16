---
name: foundry-functions
description: Build Falcon Foundry Go or Python serverless functions with FDK handlers, local tests, collection access, API integration calls, and safe error handling.
when_to_use: "Use when the user wants to create a Foundry function, write backend logic, test a function locally, call a registered API integration from a function, or connect functions to workflows or UI code."
---

# Foundry Functions

Functions are for backend logic that cannot be handled directly by API integrations, collections, workflows, or UI calls. Use them for transformation, orchestration, validation, and controlled access to Foundry capabilities.

## Before writing code

- Prefer API integrations, collections, and workflows when they solve the task without custom code.
- Confirm language choice. Python is convenient for FalconPy and data work; Go is useful for typed handlers and small binaries.
- Create function scaffolding with the Foundry CLI. Do not hand-write function manifest structure.
- Keep function inputs and outputs small and explicit.

## Credential handling

Foundry functions do not provide a generic encrypted secrets system for arbitrary third-party credentials. For third-party APIs, prefer API integrations and call them through the platform proxy. Do not store secrets in source, manifests, workflow YAML, or collection records.

## Handler patterns

- Validate request input early and return structured errors.
- Keep external calls in functions that are designed for those calls.
- For collection access, handle both success and error result shapes.
- Return workflow-friendly arrays and objects. Avoid response shapes that make workflow variables ambiguous.
- Log enough context for debugging, but never log tokens, passwords, customer data, or full request bodies unless the user explicitly asks and confirms it is safe.

## Testing

- Test locally only when the user asks or when it is required to validate the change.
- Do not start Docker or long-running local servers just to prove files exist.
- For live Falcon API calls, confirm credentials, region, and data scope before running.

## Common mistakes

- Calling third-party APIs directly with env-var credentials instead of registered API integrations.
- Writing auth or credential code that Foundry should provide.
- Returning huge payloads to workflows or UI.
- Building custom storage when a collection is sufficient.
