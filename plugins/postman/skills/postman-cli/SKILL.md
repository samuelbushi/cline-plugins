---
name: postman-cli
description: Use the local Postman CLI for request sending, collection runs, OpenAPI linting, and git-synced Postman file workflows. Use when the task needs local execution or repository files rather than Postman cloud MCP operations.
---

# Postman CLI

Use the local Postman CLI only when it is the right tool: sending local requests, running collections locally, linting specs, or working with git-synced Postman files. Do not install or authenticate the CLI unless the user asked for that action. API-key based setup belongs here, not in remote MCP auth recovery.

## Setup Checks

1. Check for the CLI with `postman --version` or `command -v postman`.
2. If it is missing, explain that the user can install `postman-cli`.
3. If authentication is needed, use `postman login` only after the user confirms.
4. Keep API keys and login output out of chat and commits.

## Git-Synced Postman Files

Postman git sync commonly uses:

```text
.postman/resources.yaml
postman/collections/
postman/environments/
postman/specs/
```

Collections may be directories with request YAML files rather than one JSON file. Inspect the folder structure before generating commands.

## Send A Request

Before sending a request:

1. Identify method, URL, headers, body, auth, and environment.
2. Show the command to the user.
3. Ask before sending requests to non-local URLs or endpoints with side effects.
4. Redact tokens and cookies from output.

## Run A Collection

Before `postman collection run`:

1. Resolve the collection ID or local collection file.
2. Resolve the environment.
3. Confirm base URL, target environment, timeout, and whether requests mutate data.
4. Run the smallest useful scope first when possible.
5. Summarize failures with likely causes and next fixes.

## Spec Linting

Use `postman spec lint <file>` for local OpenAPI checks. Fix syntax or schema issues only in files the user wants changed, and summarize the diff before syncing to Postman cloud resources.
