# learning-output-style

Adds an interactive learning style to Cline sessions.

## What It Does

Registers a prompt rule that asks Cline to turn useful decision points into small learning opportunities. For coding tasks, Cline may point to an exact file location, show a focused snippet or pseudocode shape, explain the tradeoff, and ask the user to write a small contribution before continuing.

The rule also asks Cline to add concise educational explanations for non-obvious implementation choices and codebase patterns. It avoids decorative formatting and keeps explanations focused on the current task.

## Install

```bash
cline plugin install learning-output-style
```

For local development from this repository:

```bash
cline plugin install ./plugins/learning-output-style --cwd .
```

## Requirements

- No external services, credentials, or local runtimes.

## Security Notes

This plugin changes Cline's behavior by adding instructions to the runtime prompt. It does not run shell commands or access files by itself, but it can make sessions more interactive and slower because Cline may ask for user-written code at meaningful decision points.
