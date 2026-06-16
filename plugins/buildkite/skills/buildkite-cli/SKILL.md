---
name: buildkite-cli
description: Use when the user wants to install or use the `bk` CLI for Buildkite builds, jobs, pipelines, artifacts, secrets, clusters, packages, auth, API calls, logs, retries, cancellations, or terminal-based CI workflows.
---

# Buildkite CLI

Use the `bk` CLI for terminal access to Buildkite.

## Setup

Check the user's OS and package manager before installing `bk`. On macOS with Homebrew:

```bash
brew tap buildkite/buildkite
brew install buildkite/buildkite/bk
bk configure
```

For non-interactive automation, prefer an environment variable or secret manager:

```bash
bk configure --org my-org --token "$BUILDKITE_API_TOKEN" --no-input
```

Only use the non-interactive command when `BUILDKITE_API_TOKEN` is already set by the environment or secret manager. Never print the token or commit generated config that contains credentials.

## Read-Only Commands

```bash
bk build list --pipeline my-pipeline
bk build view 42 --pipeline my-pipeline
bk job log <job-id> --pipeline my-pipeline --build 42
bk pipeline list
```

These are usually safe after the user has provided the organization and pipeline context, but logs may contain sensitive data. Redact before quoting.

## Mutating Commands

Ask before running commands that create, retry, cancel, upload, delete, or change Buildkite state:

```bash
bk build create --pipeline my-pipeline
bk build retry 42 --pipeline my-pipeline
bk build cancel 42 --pipeline my-pipeline
bk pipeline create my-pipeline
bk secret set NAME
```

## Build Workflow

To trigger and follow a build after approval:

```bash
bk build create --pipeline my-pipeline --branch feature/my-change
bk build watch 42 --pipeline my-pipeline
```

When the build fails, collect the failed job IDs first, then inspect only the relevant logs.

## API Escape Hatch

Use `bk api` when a CLI subcommand does not cover the exact endpoint. Keep request bodies in temp files when they contain structured JSON, and do not include tokens in command history.
