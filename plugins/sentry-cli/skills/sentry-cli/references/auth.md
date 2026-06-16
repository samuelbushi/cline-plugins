---
name: sentry-cli-auth
version: 0.37.0-dev.0
description: Authenticate with Sentry
requires:
  bins: ["sentry"]
  auth: true
---

# Auth Commands

Authenticate with Sentry

### `sentry auth login`

Authenticate with Sentry

Flags:
- `--token <value> - Authenticate using an API token instead of OAuth. In Cline, prefer the interactive OAuth flow unless the user explicitly provides a token out of band.`
- `--timeout <value> - Timeout for OAuth flow in seconds (default: 900) - (default: "900")`
- `--force - Re-authenticate without prompting`
- `--url <value> - Sentry instance URL to authenticate against (e.g. https://sentry.example.com). Required for self-hosted; defaults to SaaS (https://sentry.io).`
- `--read-only - Request only read-only OAuth scopes (project:read, org:read, event:read, member:read, team:read). Useful for CI jobs or local sessions that should not be able to mutate Sentry state.`
- `-s, --scope <value>... - Request specific OAuth scopes (repeatable, comma-separated). E.g. --scope project:read --scope org:read. Overrides the default scope set.`

Examples:

```bash
sentry auth login

SENTRY_URL=https://sentry.example.com sentry auth login
```

### `sentry auth logout`

Log out of Sentry

Examples:

```bash
sentry auth logout
```

### `sentry auth refresh`

Refresh your authentication token

Flags:
- `--force - Force refresh even if token is still valid`
- `--read-only - Re-authenticate with read-only OAuth scopes (project:read, org:read, event:read, member:read, team:read)`
- `-s, --scope <value>... - Re-authenticate with specific OAuth scopes (repeatable, comma-separated). E.g. --scope project:read --scope org:read`

Examples:

```bash
sentry auth refresh
```

### `sentry auth status`

View authentication status

Flags:
- `--show-token - Show the stored token (masked by default). Avoid this from Cline unless the user explicitly asks to inspect credentials, and never echo the raw token into chat or logs.`
- `-f, --fresh - Bypass cache, re-detect projects, and fetch fresh data`

Examples:

```bash
sentry auth status

# View current user
sentry auth whoami
```

### `sentry auth token`

Print the stored authentication token

Examples:

```bash
# Avoid running this from Cline unless the user explicitly asks to inspect credentials.
# If it is run, do not echo the raw token into chat or logs.
```

### `sentry auth whoami`

Show the currently authenticated identity

Flags:
- `-f, --fresh - Bypass cache, re-detect projects, and fetch fresh data`

All commands also support `--json`, `--fields`, `--help`, `--log-level`, and `--verbose` flags.
