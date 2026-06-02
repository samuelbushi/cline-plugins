# env-blocker

Blocks reads of secret `.env` files.

## What It Does

Registers a `beforeTool` hook that blocks `read_files` and `run_commands` attempts to read `.env` style secret files. Template files such as `.env.example`, `.env.sample`, and `.env.template` remain readable.

## Install

```bash
cline plugin install env-blocker
```

For local development from this repository:

```bash
cline plugin install ./plugins/env-blocker --cwd .
```

## Requirements

- No API keys or external services.

## Security Notes

This is a deterministic local guard for common secret file names. It does not detect every possible secret path or prevent access outside Cline.

