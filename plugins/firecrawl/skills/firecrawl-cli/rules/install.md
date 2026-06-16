---
name: firecrawl-cli-installation
description: |
  Install the official Firecrawl CLI and handle authentication.
  Package: https://www.npmjs.com/package/firecrawl-cli
  Source: https://github.com/firecrawl/cli
  Docs: https://docs.firecrawl.dev/sdks/cli
---

# Firecrawl CLI Installation

## Cline Setup Guidance

This Cline plugin already bundles Firecrawl skills. Do not run commands that install Firecrawl skills into every detected editor unless the user explicitly asks for that separate editor setup.

Ask before installing global npm packages, opening browser login flows, or storing API keys.

## Quick Setup

```bash
firecrawl --version
firecrawl --status
```

If the CLI is missing, ask before downloading or executing npm package code. For a one-off check after approval:

```bash
npx firecrawl-cli@1.19.6 --version
```

If the user approves a global install:

```bash
npm install -g firecrawl-cli@1.19.6
```

If `firecrawl` is already installed and the user wants to update it:

```bash
npm update -g firecrawl-cli
```

## Manual Install

```bash
npm install -g firecrawl-cli@1.19.6
```

## Verify

First check status:

```bash
firecrawl --status
```

Then run one small real request to prove install, auth, and output all work:

```bash
mkdir -p .firecrawl
firecrawl scrape "https://firecrawl.dev" -o .firecrawl/install-check.md
```

The install is healthy when both commands succeed.

## Authentication

Authenticate using the built-in login flow:

```bash
firecrawl login --browser
```

This opens the browser for OAuth authentication. Tell the user this before running it. Credentials are stored by the CLI.

### If authentication fails

Ask the user how they'd like to authenticate:

1. Login with browser (Recommended) - Run `firecrawl login --browser`
2. Enter API key manually - Run `firecrawl login --api-key "<key>"` with a key from firecrawl.dev

### Command not found

If `firecrawl` is not found after installation:

1. Ensure npm global bin is in PATH
2. After user approval, try: `npx firecrawl-cli@1.19.6 --version`
3. Reinstall: `npm install -g firecrawl-cli@1.19.6`
