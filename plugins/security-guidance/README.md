# security-guidance

Block risky structured code writes before they land in the workspace.

## What It Does

This plugin adds a runtime hook that scans proposed structured writes from Cline's `editor` and `apply_patch` tools for common security footguns such as shell execution, `eval`, unsafe HTML sinks, unsafe Python deserialization, disabled TLS verification, insecure crypto modes, unsafe XML parsing, and GitHub Actions workflow injection patterns.

When a write matches a rule, Cline blocks the tool call and explains the safer pattern to use. The plugin also registers a prompt rule telling Cline how to handle those blocks and how to document an intentional exception.

## Install

```bash
cline plugin install security-guidance
```

For local development from this repository:

```bash
cline plugin install ./plugins/security-guidance --cwd .
```

## Requirements

No external services or API keys are required. The plugin does not call an LLM, run Python hooks, inspect git history, or perform background reviews.

## Security Notes

This is a local pattern guard, not a full security review. It can miss data-flow issues, and it does not inspect files written indirectly through shell commands or external tools. It can also block intentional low-level code. To intentionally keep a risky construct, add a narrow inline `security-guidance: allow <rule-name>` comment on the same line or immediately above the code after confirming the trust boundary with the user.

## Attribution

The pattern set is adapted from the Apache-2.0 `security-guidance` plugin materials. See `NOTICE.security-guidance`.
