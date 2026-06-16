# project-guidance

Adds a skill and slash command for keeping assistant-facing project guidance concise, current, and useful.

## What It Does

Bundles the `project-guidance-auditor` skill and registers `/revise-guidance`.

The skill audits guidance files such as `AGENTS.md`, `.clinerules`, `.cline/rules`, `.cline/skills`, and `.agents/skills`, then reports where the project guidance is stale, vague, missing important workflow details, or too verbose.

The slash command captures durable learnings from the current session and instructs Cline to propose concise guidance updates before any edit.

## Install

```bash
cline plugin install project-guidance
```

For local development from this repository:

```bash
cline plugin install ./plugins/project-guidance --cwd .
```

## Example Usage

After installation, ask Cline:

```text
Audit the project guidance files for this repository.
```

Or run:

```text
/revise-guidance
```

## Requirements

- A Cline workspace with project guidance files, or a project that would benefit from creating them.
- No API keys or external services.

## Security Notes

The skill and command may propose edits, but they instruct Cline to show specific diffs and ask for approval before applying changes. They should not read secrets, private logs, or credential files when gathering guidance.
