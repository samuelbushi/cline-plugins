# TeamCity CLI

This plugin bundles a Cline skill for working with TeamCity through the user-installed `teamcity` CLI.

It helps Cline inspect builds, diagnose failed runs, read logs and tests, reason about snapshot dependency chains, validate Kotlin DSL and pipeline YAML, and guide safer TeamCity CLI usage.

## Cline Primitives

- Skill: `teamcity-cli` provides TeamCity command reference, output-format guidance, and CI troubleshooting workflows.
- Rule: `teamcity-cli-safety` keeps TeamCity operations read-first and requires explicit confirmation for server mutations, secrets, remote agent access, and build/pipeline changes.

## Requirements

Install and authenticate the TeamCity CLI before using the skill:

```bash
teamcity auth status
```

The plugin does not install the CLI, register MCP servers, store credentials, or contact TeamCity during installation.

## Attribution

The bundled TeamCity CLI skill material is derived from JetBrains TeamCity CLI guidance, licensed under Apache-2.0. See `LICENSE.teamcity-cli`.
