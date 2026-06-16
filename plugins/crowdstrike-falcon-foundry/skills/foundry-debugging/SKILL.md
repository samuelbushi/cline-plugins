---
name: foundry-debugging
description: Troubleshoot Falcon Foundry CLI errors, validation failures, deploy issues, local test failures, profile problems, headless mode, and app install problems.
when_to_use: "Use when Foundry commands fail, deploy or validate fails, local UI or function testing fails, authentication behaves unexpectedly, or the user asks to debug a Foundry app."
---

# Foundry Debugging

Debug Foundry problems systematically. Prefer the smallest command that proves the next assumption, and avoid running long or live commands unless they are needed.

## Quick diagnosis

1. Identify the failing command and exact error.
2. Confirm current directory and whether `manifest.yml` is present.
3. Check `foundry version` and whether the command needs `--no-prompt`.
4. Check profile and login state without printing secrets.
5. Run `foundry apps validate --no-prompt` before deploy-oriented debugging.
6. For UI issues, verify build output and manifest paths before changing generated fields.
7. For functions, test the smallest handler path with local inputs.

## Headless and CI issues

- If a command waits for input, add non-interactive flags or use a headless mode supported by the installed CLI.
- Do not place credentials directly in logs, workflow files, manifests, or committed env files.
- Ask before creating, deleting, or replacing CLI profiles.

## Deploy issues

- Include `--change-type` and `--change-log` for deploy commands.
- Deploy once, then poll status. Do not repeatedly redeploy just to check progress.
- If validation fails, fix the specific capability first instead of masking the error.

## Recovery

- For profile corruption, ask before deleting or recreating profiles.
- For app structure problems, prefer regenerating the affected capability with the CLI over patching many manifest paths by hand.
- For dependency problems, inspect lockfiles and package managers before reinstalling.

## Sensitive output

Redact credentials, tokens, customer data, host identifiers, user identifiers, and screenshots with sensitive content before sharing logs in chat or commits.
