---
name: agent-browser
description: Automate web pages and Electron desktop apps (VS Code, Slack, Discord, Figma, Notion, Spotify) with the agent-browser CLI, a Playwright-backed browser automation tool for AI agents. Use this when the user wants to navigate sites, fill forms, click through flows, extract data from the DOM, take screenshots, do visual QA, or drive an Electron app. Not for terminal TUIs.
---

# Agent-Browser

Drive a real browser (and Electron apps) from the terminal with the `agent-browser` CLI. It wraps Playwright with a background daemon and a headless Chromium, and exposes a compact command vocabulary built for agents: navigate, snapshot the accessibility tree into stable refs, click and type against those refs, screenshot, and assert.

Be reactive. Try the command first and only fall back to setup when something is missing. The two failures worth recovering from are "command not found" (the CLI is not installed) and "browser is not installed" (the Chromium binary has not been downloaded yet).

## Setup

The CLI is a public npm package and the browser binaries are downloaded once. Do not gate on anything being preinstalled; recover when a command fails.

### 1. Install the CLI if it is missing

Check whether the CLI is on PATH, and install it globally only when it is not:

```sh
command -v agent-browser >/dev/null 2>&1 || npm install -g agent-browser
```

If the global install fails because of npm permissions, fall back to running it without a global install:

```sh
npx -y agent-browser <command> [args]
```

Use the same form consistently for the rest of the session once you pick one.

### 2. Install the browser binary on first use

The first real command may fail with a message that the browser is not installed. When that happens, download the binaries once and retry:

```sh
agent-browser install
```

On Linux, if Chromium then fails to launch because of missing system libraries, install those too:

```sh
agent-browser install --with-deps
```

This is a one-time download per machine. Reuse it afterward.

## Authoritative command reference

The CLI ships its own version-matched docs. Prefer them over guessing flags, and load them once at the start of a browser task:

```sh
agent-browser skills get core --full
```

That prints the full command reference, ref and selector usage, and copy-paste templates that always match the installed version. Specialized guides are available too:

```sh
agent-browser skills list
agent-browser skills get electron   # VS Code, Slack, Discord, Figma, Notion, ...
agent-browser skills get slack
```

When you need a command or flag you are unsure about, read the relevant skill instead of inventing syntax.

## Core workflow

Every interaction is the same loop: navigate, snapshot to get refs, act on a ref, re-snapshot, close.

```sh
agent-browser open example.com        # auto-prepends https:// if no protocol
agent-browser snapshot -i             # interactive elements only, returns refs like @e1, @e2
agent-browser click @e3               # act using a ref from the latest snapshot
agent-browser snapshot -i             # refs invalidate after navigation or DOM changes, so re-snapshot
agent-browser fill @e1 "hello"        # clear and type
agent-browser screenshot out.png      # capture for visual verification
agent-browser close                   # always close when done
```

Commands share a persistent daemon, so `&&` chaining is safe when you do not need to parse intermediate output:

```sh
agent-browser open example.com && agent-browser wait --load networkidle && agent-browser snapshot -i
```

## Electron apps

Any Electron app exposes a debugging port because it is built on Chromium. Quit the app first, relaunch it with the port, then connect:

```sh
# Linux example
slack --remote-debugging-port=9222 &
sleep 3
agent-browser connect 9222
agent-browser snapshot -i
```

Read `agent-browser skills get electron` for per-app details (tab and webview switching, custom input fields, dark mode).

## Gotchas

- Re-snapshot after every navigation, form submit, or dynamic content change. Refs from a stale snapshot will not resolve.
- Always `agent-browser close` (or `close --all`) when finished to free the Chromium process.
- Take a screenshot for any visual check. Text snapshots miss layout, styling, and z-index issues. `screenshot --annotate` overlays numbered labels that map to refs.
- Single-page apps can take several seconds to render. Pair `wait --load networkidle` with a short fixed `wait` when a page settles slowly.
- For `contenteditable` or custom inputs that do not appear in the snapshot, use `keyboard inserttext` or drive them through `eval`. See the core skill.
