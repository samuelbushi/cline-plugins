# automation-recommender

Adds a read-only skill for recommending useful Cline automations for the current workspace.

## What It Does

Bundles the `cline-automation-recommender` skill. The skill inspects project structure, dependencies, tests, CI, deployment, and service integrations, then recommends a small set of practical Cline plugins, MCP servers, skills, hooks, rules, commands, or subagent workflows.

It is intentionally advisory. It does not install plugins, edit settings, generate files, or start local services.

## Install

```bash
cline plugin install automation-recommender
```

For local development from this repository:

```bash
cline plugin install ./plugins/automation-recommender --cwd .
```

## Example Usage

After installation, ask Cline:

```text
Recommend Cline automations for this repository.
```

This installs the `cline-automation-recommender` skill. You can also ask Cline to use that skill by name or inspect available skills with `/skills`.

## Requirements

- A Cline workspace to inspect.
- No API keys or external services.

## Security Notes

The bundled skill is read-only guidance. It should inspect repository files and configuration only enough to make recommendations, and it should ask before taking any implementation step.
