---
name: postman-workflows
description: Plan Postman API lifecycle workflows such as generating OpenAPI specs, syncing collections, creating mocks, publishing docs, running tests, and auditing security. Use when the user wants a structured Postman task flow.
---

# Postman Workflows

Use this skill to choose the right Postman workflow and keep the task bounded.

## Intent Routing

- Setup or auth: verify MCP authorization and workspace access.
- Sync or import: local spec to Postman spec and collection.
- Search or discover: find APIs, endpoints, and response shapes.
- Test: run a collection or inspect existing tests.
- Mock: create or inspect mock servers from collections and examples.
- Docs: improve, generate, or publish API docs.
- Security: inspect auth, sensitive data, transport, validation, and OWASP API risk.
- Generate spec: infer OpenAPI from local routes and models.
- Context or client generation: use Postman collection/spec details to produce local client code or request helpers.

## Local Spec Generation

When generating or updating OpenAPI:

1. Find existing specs first.
2. Discover routes from the framework in use.
3. Preserve existing descriptions, examples, and server definitions where possible.
4. Include auth schemes and error responses.
5. Write to a clear workspace path only after user approval.
6. Lint the spec before cloud sync.

## Security Review

For API security reviews, inspect:

- Missing or inconsistent authentication.
- Sensitive fields in examples, docs, collections, environments, and logs.
- Insecure server URLs.
- Weak input validation.
- Missing rate limit or abuse guidance.
- Over-broad scopes in generated clients or examples.
- Error responses that leak implementation details.

Report issues by severity and include concrete remediation steps.

## Mock Server Workflow

Mock servers need usable examples. If examples are missing, generate draft examples from schemas and ask the user to review them before creating or publishing a mock.

## Documentation Workflow

Documentation should be useful without exposing secrets. Check auth instructions, examples, error cases, pagination, rate limits, and environment placeholders before publishing.

## Confirmation Gates

Ask before:

- Creating or updating Postman cloud resources.
- Deleting anything.
- Publishing documentation.
- Making mocks public.
- Writing generated files.
- Running broad test suites.
- Sending requests outside localhost or the user's stated dev environment.
