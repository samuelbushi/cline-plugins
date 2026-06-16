# hookify

Creates workspace-local guardrails that block matching Cline tool calls.

## What It Adds

Hookify registers a runtime `beforeTool` hook and three slash commands. Rules live in `.cline/hookify.*.local.md` files inside the current workspace and are reloaded on each tool call, so edits take effect immediately.

The hook watches:

- `run_commands` for shell command rules.
- `editor` and `apply_patch` for file edit rules.

When an enabled rule matches and its action is `block`, Hookify skips the tool call and returns the rule message to Cline.

## Commands

Create a rule:

```text
/hookify <name> | <bash|file|all> | <regex> | <message>
```

Examples:

```text
/hookify block-dangerous-rm | bash | rm\s+-rf | Destructive rm command blocked. Use a safer command.
/hookify block-env-edits | file | \.env$ | Edits touching environment files are blocked.
```

List rules:

```text
/hookify:list
```

Configure rules:

```text
/hookify:configure enable <name>
/hookify:configure disable <name>
/hookify:configure delete <name>
```

## Rule Format

```markdown
---
name: block-dangerous-rm
enabled: true
event: bash
action: block
pattern: rm\s+-rf
---

Destructive rm command blocked. Use a safer command.
```

Supported events are `bash`, `file`, and `all`. Simple `pattern` rules match the command text for `bash` and both the file path and edit or patch text for `file`.

Advanced rules can use conditions:

```markdown
---
name: block-env-token-edits
enabled: true
event: file
action: block
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.env$
  - field: new_text
    operator: regex_match
    pattern: API_KEY|TOKEN|SECRET
---

Credential-looking edits to environment files are blocked.
```

Supported operators are `regex_match`, `contains`, `equals`, `not_contains`, `starts_with`, and `ends_with`.

## Requirements

No external service, API key, or local runtime is required. Hookify only reads `.cline/hookify.*.local.md` files from the active workspace.

## Trust Boundary

Hookify rules are workspace-local policy. Review them before relying on them, especially in repositories you did not create. Invalid regex patterns are ignored rather than blocking tool calls.
