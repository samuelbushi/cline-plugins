# explanatory-output-style

Adds an explanatory response style to Cline for software development sessions.

## What It Does

Registers a prompt rule that asks Cline to include concise educational context around non-trivial implementation choices. The rule focuses on repository-specific patterns, design tradeoffs, and why a change fits the codebase.

This plugin does not run commands, install hooks, register tools, or mutate project files. It only contributes additional prompt guidance.

## Install

```bash
cline plugin install explanatory-output-style
```

For local development from this repository:

```bash
cline plugin install ./plugins/explanatory-output-style --cwd .
```

## Example Usage

After installation, use Cline normally:

```text
Refactor this module to make the validation path easier to follow.
```

## Requirements

No external services, credentials, or local tools are required.

## Security Notes

This plugin registers prompt guidance only. It does not add tools, hooks, commands, file access, shell commands, network calls, or credential handling.

## Notes

This plugin increases response verbosity and token usage. It is best for learning-oriented coding sessions, onboarding, and codebase exploration. Disable or uninstall it when you want terse implementation output.

## Attribution

Adapted from Anthropic's `explanatory-output-style` plugin, licensed under Apache-2.0. See `LICENSE.explanatory-output-style` and `NOTICE.explanatory-output-style`.
