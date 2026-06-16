---
name: base44-cli
description: Use this skill for Base44 project initialization, local project setup, resource configuration, type generation, and deployment workflows that involve the Base44 CLI.
---

# Base44 CLI

Use this skill for Base44 CLI workflows. Do not run Base44 commands automatically; confirm intent and explain the command first.

## Project State

Start by inspecting the workspace:

1. If `base44/config.jsonc` exists, treat this as an existing Base44 project.
2. If a Base44 app was provisioned externally and an app ID is available from the user or environment, prefer scaffolding local files for that existing app instead of creating a duplicate app.
3. If no Base44 project exists and the user wants a new app, plan project creation before running CLI commands.

## Common Commands

Use `npx base44 <command>` only after confirming the project has the `base44` CLI installed locally or after the user approves installing it as a dev dependency.

- `npx base44 whoami`: verify authentication.
- `npx base44 login`: authenticate manually.
- `npx base44 create`: create a new Base44 app.
- `npx base44 scaffold`: set up local files for an existing Base44 app.
- `npx base44 link`: link a local project to an existing Base44 app.
- `npx base44 types generate`: generate TypeScript types for entities, functions, and agents.
- `npx base44 entities push`: push entity schema changes.
- `npx base44 functions deploy`: deploy backend functions.
- `npx base44 deploy`: deploy project resources and site.
- `npx base44 secrets set/delete/list`: manage function secrets.

## Guardrails

- Ask before installing the CLI, running any `npx base44` command, creating apps, scaffolding files, linking projects, pushing resources, deploying, opening dashboards, or viewing, listing, setting, deleting, or otherwise handling secrets.
- Do not run `npx base44 create` when the app already exists; use scaffold or link instead.
- Show planned file changes and deployment commands before applying them.
- Do not print access tokens, refresh tokens, app IDs, secret names or values, connector credentials, or dashboard URLs with sensitive identifiers unless the user explicitly asks.
- Prefer `whoami`, config inspection, and dry-run-style explanation before commands that mutate remote resources.

## Resource Configuration

When authoring Base44 project files:

- Keep entity schemas in `base44/entities/*.jsonc`.
- Keep backend functions in `base44/functions/<name>/`.
- Keep AI agent configuration in `base44/agents/*.jsonc` only when the user wants Base44 agents.
- Keep OAuth connector configuration in `base44/connectors/*.jsonc`.
- Generate types after resource changes when TypeScript code depends on typed entities, functions, or agents.
