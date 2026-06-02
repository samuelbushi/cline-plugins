# agents-squad

Status: demo
Source: Cline SDK examples

Background subagents for Cline sessions.

## What It Does

Registers tools for starting, listing, messaging, polling, and coordinating subagents. The plugin includes agent presets, bundled skills, and a handoff store so subagents can pass notes back to the parent session.

## Install

```bash
cline plugin install agents-squad
```

For local development from this repository:

```bash
cline plugin install ./plugins/agents-squad --cwd .
```

## Requirements

- A Cline host with plugin package support.
- Provider credentials configured for any model used by the selected subagent preset.

## Security Notes

Subagents run normal Cline SDK sessions and can use whatever tools the host exposes to them. Review presets before using this in a sensitive workspace.

