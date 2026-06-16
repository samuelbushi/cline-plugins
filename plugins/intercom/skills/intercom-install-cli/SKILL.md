---
name: intercom-install-cli
description: Install and authenticate the optional @intercom/cli for shell-based Intercom workflows. Use when the user asks to install the Intercom CLI, set up the intercom command, or script Intercom operations from the terminal.
---

# Intercom CLI Setup

Set up `@intercom/cli` only when the user asks for shell access or scripting. The MCP server is enough for in-chat read workflows; the CLI is optional.

## Prerequisites

Check:

```bash
node --version
npm --version
```

Node.js must be 20.6 or newer. If the version is older, stop and ask the user to upgrade with their preferred version manager.

## Install

Ask before installing a global package. If approved:

```bash
npm install -g @intercom/cli
intercom --version
```

If global npm permissions fail, prefer a user-managed Node version through nvm, fnm, or volta. Do not recommend `sudo npm install -g`.

## Authenticate

For an existing workspace, the user creates or copies an access token from the Intercom Developer Hub. Keep tokens out of the transcript when possible.

Preferred interactive login:

```bash
intercom auth login --token "$INTERCOM_TOKEN"
```

For CI or temporary scripting:

```bash
export INTERCOM_TOKEN="..."
```

Ask before writing tokens to shell profile files. Never print the token back.

## Verify

```bash
intercom me
```

If the workspace is hosted outside the US region, configure the API base URL before running commands:

```bash
export INTERCOM_API_BASE_URL="https://api.eu.intercom.io"
export INTERCOM_API_BASE_URL="https://api.au.intercom.io"
```

Use only the region that matches the user's workspace.
