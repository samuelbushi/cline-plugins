---
name: appwrite-deployments
description: Use when preparing or running Appwrite site and function deployment workflows. Requires config review and explicit confirmation before push, deploy, delete, or force operations.
---

# Appwrite Deployments

Use this skill when the user wants to deploy, update, or inspect Appwrite sites or functions.

## Guardrails

- Never run deployment, push, delete, or force commands automatically.
- Read `appwrite.config.json` before proposing a deployment command.
- Summarize the endpoint, project ID, resource type, resource ID, local path, build command, runtime, and output directory before execution.
- Ask the user to confirm the exact command before running it.
- Avoid production-impacting commands when the target project or endpoint is unclear.

## Sites

For site work:

- Check the `sites` section in `appwrite.config.json`.
- Verify framework, build command, output directory, adapter, timeout, and site path.
- Run the local build or tests first when the repository has a clear script.
- Prefer a single site push with a specific site ID when possible.

Typical command shape after confirmation:

```bash
appwrite push sites --site-id <SITE_ID>
```

Use `--force` only when the user has approved the exact force command.

## Functions

For function work:

- Check the `functions` section in `appwrite.config.json`.
- Verify runtime, entrypoint, install command, timeout, path, events, schedule, and environment variable needs.
- Run local tests or lint when available.
- Prefer a single function push with a specific function ID when possible.

Typical command shape after confirmation:

```bash
appwrite push functions --function-id <FUNCTION_ID>
```

## Pull Before Push

If the local config may be stale, suggest pulling first:

```bash
appwrite pull functions
appwrite pull sites
```

Do not overwrite local changes without checking the git diff.

## Secrets

- Keep function environment variables out of source control.
- Do not commit API keys, webhook secrets, session secrets, or `.env` files.
- If a deployment needs secrets, confirm they are configured through Appwrite or the deployment environment rather than embedded in code.
