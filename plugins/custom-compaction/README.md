# custom-compaction

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

## Example Usage

After installation, continue a long Cline session and ask:

```text
Summarize where we landed, keep the current implementation constraints in mind, and continue with the next change.
```

Before provider requests, `custom-compaction` rewrites older middle history into a compact summary while preserving the first user message and recent context.

## Requirements

- A Cline host with plugin message builder support.

## Security Notes

The plugin rewrites model-bound context. Test it before using it in workflows where exact full-history preservation matters.
