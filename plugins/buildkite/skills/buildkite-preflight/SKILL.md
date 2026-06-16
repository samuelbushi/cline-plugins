---
name: buildkite-preflight
description: Use when the user asks to run Buildkite preflight, run CI against local changes, verify uncommitted work in Buildkite, or understand `bk preflight` behavior.
---

# Buildkite Preflight

Preflight runs Buildkite CI against the local working tree. It can create a temporary commit, push a temporary branch to `origin`, and start a remote Buildkite build.

Do not run preflight unless the user asks for it or has clearly approved a CI run.

## Requirements

- `bk` CLI installed.
- Authenticated Buildkite CLI or API token.
- Git repository with at least one commit.
- Push access to the repository remote.
- Pipeline slug, preferably in `org/pipeline` form.

## Common Commands

```bash
bk preflight --pipeline my-org/my-pipeline --watch --text
bk preflight --pipeline my-org/my-pipeline --watch --exit-on=build-terminal
bk preflight --pipeline my-org/my-pipeline --no-watch
bk preflight --pipeline my-org/my-pipeline --watch --json
```

Use plain text output for human review. Use JSON only when another command will parse the event stream.

## Before Running

1. Confirm the pipeline slug and remote.
2. Check whether the working tree contains unrelated user changes.
3. Explain that preflight may push a temporary branch and consume CI capacity.
4. Avoid shell timeouts on watched preflight runs.

## Reading Results

- If the build fails because of the current change, inspect the failed job log and fix it.
- If the failure is unrelated, flaky, or infrastructure-caused, report that clearly.
- If Test Engine summaries are present, use them to identify failing suites and tests.
- Preserve build URLs and job IDs in the final report.

## Safety

Never paste full environment dumps or secrets from Buildkite logs. Redact tokens and credentials before sharing output.
