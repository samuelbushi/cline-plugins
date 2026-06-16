---
name: forge-debugger
description: Diagnose Atlassian Forge app failures. Use for forge deploy errors, forge install issues, missing modules, blank UI, resolver failures, permission problems, logs, tunnel issues, or production versus development discrepancies.
---

# Forge Debugger

Use this skill when a Forge app is broken or behaving unexpectedly.

## Triage

Classify the issue first:

- Deploy-time: `forge deploy` or `forge lint` fails.
- Install or visibility: app deployed but does not appear on the target site.
- Runtime: resolver errors, blank UI, wrong data, missing permissions, or production-only behavior.
- Local development: tunnel, Custom UI build, package install, or CLI auth problems.

## Workflow

1. Confirm app directory, environment, product, target site, and the exact error or symptom.
2. Run cheap checks first, after user approval when they mutate local state:
   ```bash
   forge --version
   forge lint
   ```
3. For deploy failures, trust `forge lint` and deploy output before guessing from source.
4. For Custom UI blank screens, check whether the frontend build output exists and is current.
5. For runtime errors, inspect resolver names, handler exports, manifest function keys, scopes, and logs:
   ```bash
   forge logs -e development --limit 100
   ```
6. For production issues, ask for the affected Atlassian site before reading production logs.
7. Fix one root cause at a time and verify before moving to the next.

## Common Causes

- Handler path includes `src/` even though Forge resolves handlers relative to `src`.
- Frontend `invoke()` name does not match backend `resolver.define()`.
- Required scope was added but the app was not upgraded on the site.
- Custom UI was changed but the static bundle was not rebuilt before deploy.
- The app was installed on the wrong product or site.
- External fetch call lacks a matching manifest egress entry.
- Forge CLI is missing, outdated, or not logged in.

## Safety

- Do not ask for API tokens in chat. Use `forge login` in the user's terminal.
- Ask before installing packages, deploying, installing, upgrading, tunneling, or changing production config.
- Remove temporary debug logs once they are no longer needed.
