# gitignore-read-files-guard

Blocks Cline file access to paths ignored by `.gitignore`.

## What It Does

Registers a `beforeTool` hook for file-reading and file-editing tools. If a requested path matches workspace `.gitignore` rules, the hook skips the tool call.

## Install

```bash
cline plugin install gitignore-read-files-guard
```

For local development from this repository:

```bash
cline plugin install ./plugins/gitignore-read-files-guard --cwd .
```

## Requirements

- A git workspace with `.gitignore` rules.

## Security Notes

This only applies to Cline tool calls. It does not change filesystem permissions or git behavior.

