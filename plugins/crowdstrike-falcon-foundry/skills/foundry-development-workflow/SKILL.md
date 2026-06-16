---
name: foundry-development-workflow
description: Plan and build CrowdStrike Falcon Foundry apps from requirements through scaffold, capability selection, validation, deploy, and release.
when_to_use: "Use when the user wants to create, build, deploy, release, or plan a Falcon Foundry app, or asks about Foundry app architecture. For a specific capability inside an existing app, use the matching Foundry skill."
---

# Foundry Development Workflow

Use the Foundry CLI as the source of truth for app structure. Do not hand-write app directories, capability manifests, or `manifest.yml` entries that the CLI normally creates.

## App flow

1. Clarify the app purpose, target users, data sources, UI surfaces, automation flows, and deployment region.
2. Confirm the app name and the capabilities to create before running commands that create resources.
3. Check prerequisites: `foundry version`, login/profile status, working directory, and whether commands need non-interactive flags.
4. Scaffold with the CLI, usually `foundry apps create --name "<name>" --no-prompt`.
5. Add capabilities with the specific skill for each type: API integrations, collections, functions, workflows, UI, e2e tests, or security review.
6. Validate early with `foundry apps validate --no-prompt`. Fix capability errors before building UI on top of broken backend pieces.
7. Deploy only after the user confirms the deployment target and change description.
8. Release only after deployment succeeds and the user confirms release intent.

## CLI guardrails

- Add `--no-prompt` to create, validate, release, delete, and profile commands that support it.
- For `foundry apps deploy`, include both `--change-type` and `--change-log`.
- For UI extensions, specify `--sockets` explicitly. Do not guess socket IDs.
- Confirm resource names with the user before creating apps, functions, collections, workflows, API integrations, pages, extensions, or RTR scripts.
- If the CLI hangs or opens an interactive picker, stop and switch to a non-interactive command shape.

## App root discipline

Foundry commands resolve paths from the current working directory. Before running `foundry apps validate`, `foundry apps deploy`, or app-level UI commands, verify the current directory contains `manifest.yml`.

## Trust boundaries

Ask before using credentials, deploying, releasing, deleting resources, changing production app configuration, or reading sensitive Falcon data. Do not print secrets or commit profile files, `.env` files, test credentials, screenshots with customer data, or exported app data.
