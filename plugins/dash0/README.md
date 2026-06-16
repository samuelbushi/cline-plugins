# dash0

Exports Cline run and tool activity as OpenTelemetry traces for Dash0.

## What It Does

Registers runtime hooks that observe completed Cline runs and tool calls. When configured, the plugin sends compact OTLP trace spans to a Dash0 endpoint. The plugin does not install binaries, spawn subprocesses, modify workspace files, or send telemetry unless `DASH0_OTLP_URL` is set.

By default, prompt text, final response text, tool inputs, tool outputs, workspace paths, Git metadata, and local user identity are omitted. Set the opt-in variables below only when the workspace and organization policy allow sending that content to Dash0.

## Install

```bash
cline plugin install dash0
```

For local development from this repository:

```bash
cline plugin install ./plugins/dash0 --cwd .
```

## Configuration

Configure the Cline process environment before starting a session:

```bash
DASH0_OTLP_URL="https://ingress.<region>.aws.dash0.com" \
DASH0_AUTH_TOKEN_FILE="$HOME/.config/dash0/cline-token" \
cline
```

Supported variables:

- `DASH0_OTLP_URL` sets the OTLP HTTP endpoint base URL.
- `DASH0_AUTH_TOKEN_FILE` reads the bearer token from a local file.
- `DASH0_AUTH_TOKEN` sends a bearer token from the process environment.
- `DASH0_DATASET` sets the Dash0 dataset header.
- `DASH0_AGENT_NAME` sets `service.name`; defaults to `cline`.
- `DASH0_TEAM_NAME` adds `dash0.team.name`.
- `DASH0_OMIT_IO` controls prompt/tool I/O export; defaults to `true`.
- `DASH0_OMIT_USER_INFO` omits the local username; defaults to `true`.
- `DASH0_INCLUDE_WORKSPACE=true` includes workspace root, Git branch, commit, and remote URL.
- `DASH0_DEBUG=true` prints OTLP payloads and export errors to stderr.

## Trust Boundaries

Environment variables may be inherited by commands that Cline runs. Prefer `DASH0_AUTH_TOKEN_FILE` over `DASH0_AUTH_TOKEN` so the token value itself is not present in the process environment. Keep the token file outside the workspace, user-owned, and readable only by the user.

OTLP export runs best-effort in the background. Failures are logged only when `DASH0_DEBUG=true` and never block the user run. This plugin is an observability integration, not a policy or security control.
