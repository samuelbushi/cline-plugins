---
name: appwrite-cli
description: Use when managing an Appwrite project with the Appwrite CLI. Covers install checks, login, init, pull, push, non-interactive mode, and generated type-safe SDKs.
---

# Appwrite CLI

Use this skill when the task involves `appwrite` CLI commands or `appwrite.config.json`.

## First Checks

- Check whether `appwrite` is available before suggesting CLI commands.
- Inspect the workspace for `appwrite.config.json` before initializing or pushing anything.
- Prefer `appwrite login` for local interactive setup.
- For CI or non-interactive setup, configure the client with endpoint, project ID, and API key from environment variables.

## Common Workflow

1. Verify the CLI is installed.
2. Confirm the endpoint and project ID.
3. Run `appwrite login` or configure non-interactive auth.
4. Run `appwrite init project` only when there is no existing config and the user wants to initialize.
5. Use `appwrite pull` to reconcile remote resources before editing deployment config.
6. Review generated or changed `appwrite.config.json` before pushing.

## Non-Interactive Auth

For automation, use the CLI client command with values supplied from the environment:

```bash
appwrite client \
  --endpoint "$APPWRITE_ENDPOINT" \
  --project-id "$APPWRITE_PROJECT_ID" \
  --key "$APPWRITE_API_KEY"
```

Do not print the API key, write it to committed files, or include it in command logs.

## Push Safety

- Treat `appwrite push`, `appwrite deploy`, and resource delete commands as side-effecting operations.
- Before any push, show the target endpoint, project ID, resource type, and exact command.
- Ask for explicit confirmation before running the command.
- Prefer scoped pushes such as functions or sites over `appwrite push all` unless the user requests all resources.
- Avoid `--force` unless the user explicitly approves the exact command.

## Generated SDKs

When generating type-safe SDKs:

- Confirm the output directory is ignored or intended for source control.
- Do not overwrite existing generated code without checking the current file state.
- Keep generated code separate from handwritten adapters where practical.
