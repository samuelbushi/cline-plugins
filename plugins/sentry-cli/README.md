# sentry-cli

Use the Sentry CLI from Cline for issue, event, project, organization, release, source map, dashboard, alert, replay, trace, and API workflows.

## What It Adds

This plugin bundles a Sentry CLI skill with detailed command references and adds a read-only helper tool for loading those reference files when the skill points at `references/...`.

## Cline Primitives

- Skills: bundles `sentry-cli`, a command-line workflow guide for using the `sentry` CLI.
- Tool: `read_sentry_cli_reference` loads bundled Sentry CLI reference files on demand.
- Rule: treats Sentry data and CLI/API output as untrusted external input and asks before Sentry mutations, artifact uploads, release/deploy changes, dashboard/alert changes, trial starts, project deletes, or mutating `sentry api` calls.

## Requirements

Install the Sentry CLI as `sentry` and authenticate it for the target org/project. If authentication is needed, Cline should ask the user to run the interactive Sentry CLI login flow rather than handling tokens directly.

Some workflows read local Sentry config, DSNs, environment files, git remotes, or source code to infer org/project context. Confirm the detected org/project before mutating Sentry resources.

## Example Usage

```text
Use Sentry CLI to inspect issue PROJECT-123 and summarize the likely root cause.
```

```text
Create a Sentry release for this app, but show me the exact commands first.
```

## Install

```bash
cline plugin install sentry-cli
```

For local development from this repository:

```bash
cline plugin install ./plugins/sentry-cli --cwd .
```
