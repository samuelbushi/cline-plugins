# custom-compaction

Status: demo
Source: Cline SDK examples

Compacts provider-bound message history through a plugin message builder.

## What It Does

Registers a message builder that preserves the first user message and recent context, then summarizes older middle history before the model request is sent.

## Install

```bash
cline plugin install custom-compaction
```

For local development from this repository:

```bash
cline plugin install ./plugins/custom-compaction --cwd .
```

## Requirements

- A Cline host with plugin message builder support.

## Security Notes

The plugin rewrites model-bound context. Test it before using it in workflows where exact full-history preservation matters.

