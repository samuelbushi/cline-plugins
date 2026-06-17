---
name: cortex-setup
description: Install, verify, or troubleshoot Snowflake CLI and Cortex Code CLI for Cline. Use when cortex is not installed, Snowflake connections are missing, or a Cortex Code workflow cannot start.
---

# Cortex Code Setup

Use this skill when the user wants to set up Snowflake Cortex Code, when
`cortex` is missing from PATH, or when a Cortex workflow fails before it can
reach Snowflake.

Do not install software, clone repositories, modify shell profiles, or create
Snowflake connections without explicit user approval. Prefer verification first.

## Verify Current State

Check the local CLI tools:

```bash
command -v cortex && cortex --version
command -v snow && snow --version
```

On Windows, use:

```powershell
where cortex
cortex --version
where snow
snow --version
```

If `cortex` is missing, tell the user Cortex Code CLI is required and direct
them to the official Snowflake Cortex Code CLI installation docs. Do not invent
an installer command. If the user wants Cline to help install it, first inspect
the official docs or user-provided installer instructions, then show the exact
command and wait for approval.

## Verify Snowflake Connection

Check configured connections:

```bash
snow connection list
```

If no usable connection exists, ask the user which Snowflake account,
authentication method, role, warehouse, database, and schema they want to use.
Then use Snowflake CLI's interactive connection flow only after user approval:

```bash
snow connection add
```

Do not ask the user to paste passwords, private keys, API tokens, or complete
credential files into chat. If key-pair auth is needed, have the user manage key
files locally and reference Snowflake's official setup docs.

## Verify Cortex Can Run

After the CLI and connection are ready, run a harmless version or help command:

```bash
cortex --version
cortex --help
```

For a live smoke check, ask the user before running any command that contacts
Snowflake. Prefer read-only requests such as listing accessible databases or
describing a known object.

## Safety Notes

- Treat `.env`, `.snowflake`, private keys, cloud credential stores, and token
  files as sensitive. Do not read them or send their contents to Cortex Code.
- Prefer read-only Cortex workflows until the user explicitly asks for object,
  data, or deployment changes.
- If an existing Snowflake MCP server is configured, do not assume it conflicts.
  Explain that it is a separate integration and ask which path the user wants
  to use for the current task.
