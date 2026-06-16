---
name: postman-routing
description: Route Postman and API lifecycle requests to the right Postman skill or the /postman command.
---

# Postman Command Routing

When the user's request involves Postman or APIs, route to the appropriate Postman skill or the `/postman` command. Prefer the bundled Postman skills or the `/postman` command over ad hoc MCP tool calls. Skills provide structured workflows, error diagnosis, and formatted output.

## Routing Table

| User Intent | Skill | Why |
|-------------|---------|-----|
| Import a spec, push spec to Postman, create collection from spec | `postman-sync` skill | Creates spec + collection + environment, handles async polling |
| Sync collection, update collection, keep in sync, push changes | `postman-sync` skill | Full sync workflow with change reporting |
| Find API, search endpoints, what's available, is there an API for | `postman-search` skill | Searches private workspace first, drills into details |
| Run tests/check if tests pass through the Postman MCP server, validate cloud collection behavior | `postman-test` skill | Runs collection, parses results, diagnoses failures, suggests fixes |
| Create mock server, fake API, mock for frontend | `postman-mock` skill | Checks for examples, generates missing ones, provides integration config |
| Generate docs, improve documentation, publish docs | `postman-docs` skill | Analyzes completeness, fills gaps, can publish to Postman |
| Security audit, check for vulnerabilities, OWASP | `postman-security` skill | 20+ security checks with severity scoring and remediation |
| Set up Postman, authorize MCP, first-time setup | `postman-setup` skill | Guided setup with workspace verification |
| Send a request, test endpoint, hit the API, call URL | `postman-send-request` skill | CLI-based HTTP requests with auth, headers, body support |
| Generate spec, create OpenAPI, document my API | `postman-generate-spec` skill | Scans code for routes, generates OpenAPI YAML, validates with lint |
| Run collection locally with the Postman CLI, use a local collection file, or avoid cloud execution | `postman-run-collection` skill | Runs collection by local file or cloud ID through the local CLI, parses results, suggests fixes |
| Explore API, install API, integrate with API, generate client from Postman collection, maintain installed requests or client code | `postman-context` skill | Fetches real API definitions, generates and maintains typed client code. |
| Is my API agent-ready?, scan my API, analyze my spec | `postman-agent-ready-apis` skill | 48 checks across 8 pillars, scoring and fix recommendations |

## Routing Rules

1. Specific commands take priority. If the intent clearly maps to one command, use it.
2. Agent-readiness questions go to the readiness skill. Phrases like "agent-ready", "scan my API", "analyze my spec for AI" trigger the `postman-agent-ready-apis` skill.
3. Ambiguous requests get clarified. For tests, prefer `postman-test` when the user wants Postman MCP/cloud collection runs and `postman-run-collection` when the user wants local CLI execution. If you can't determine intent, ask: "I can sync collections, generate client code, search for APIs, run tests, create mocks, generate docs, or audit security. What do you need?"
4. Multi-step requests chain skills. "Import my spec and run tests" = `postman-sync` skill then `postman-test` skill.

## When to Use Direct MCP Tools

Only use `Postman MCP *` tools directly when:
- Making a single, targeted update (e.g., updating one request's body)
- The user explicitly asks to call a specific MCP tool
- The task doesn't match any command workflow
