---
name: teamcity-cli
version: 1.0.0
description: Use when working with TeamCity CI/CD or when a user provides a TeamCity build URL - drives the `teamcity` CLI for builds, logs, jobs, queues, agents, pools, projects, and pipelines.
---

# TeamCity CLI (`teamcity`)

## Quick Start

```bash
teamcity auth status                    # Check authentication
teamcity run list --status failure      # Find failed builds
teamcity run log <id> --failed --raw    # Full failure diagnostics
```

__Do not guess flags or syntax.__ Use the [command reference](references/commands.md) or `teamcity <command> --help`. Builds are __runs__ (`teamcity run`); build configurations are __jobs__ (`teamcity job`). Never use `--count` - use `--limit` (or `-n`).

## Gotchas

- __Composite builds have empty logs__ - drill into child builds for the actual failure.
- __Build chains fail bottom-up__ - deepest failed dependency is the root cause. Use `teamcity run tree <id>`.
- __`--local-changes` excludes Kotlin DSL__ - push `.teamcity/` changes before running.
- __`TEAMCITY_URL` alone bypasses stored auth__ - set both `TEAMCITY_URL` and `TEAMCITY_TOKEN`, or leave unset.
- __Logs__: use `--raw` and dump to a temp file. __Builds__: use `--watch` when starting them.
- __VCS triggers aren't always wired up__ - after pushing a fix you may need to start builds manually.
- __`pipeline push` does not validate__ - always `teamcity pipeline validate` first.
- __GitHub VCS roots: use a GitHub App connection.__ Never paste a PAT via `--auth password`. See [workflows](references/workflows.md).

## Cline Compatibility

- This skill assumes the user has installed and authenticated the `teamcity` CLI. Do not install it, run auth flows, or contact TeamCity unless the user asks.
- Start with read-only commands whenever possible: `auth status`, `list`, `view`, `log`, `tests`, `changes`, `tree`, `settings status`, and validation commands.
- Ask before mutating TeamCity state: starting/restarting/canceling builds, pin/tag/comment metadata changes, queue changes, job/project/parameter edits, project token put/get, connection/VCS changes, pipeline pushes/deletes, agent enable/disable/exec/term/reboot, raw API writes, or artifact downloads outside a temp/user-approved path.
- Ask before committing or pushing repository changes, even when a TeamCity verification workflow recommends it.
- Use temp files for large logs and artifacts unless the user asks to write them into the workspace.
- The source background build-monitoring agent is intentionally not installed here. Use the "Monitoring Builds Until Green" workflow as an explicit, user-steered loop.

## Core Commands

| Area      | Commands                                                                                          |
|-----------|---------------------------------------------------------------------------------------------------|
| Auth      | `auth login`, `logout`, `status`                                                                  |
| Builds    | `run list`, `view`, `start`, `watch`, `log`, `cancel`, `restart`, `tests`, `changes`, `tree`      |
| Artifacts | `run artifacts`, `run download`                                                                   |
| Metadata  | `run pin/unpin`, `run tag/untag`, `run comment`                                                   |
| Jobs      | `job list`, `view`, `create`, `tree`, `pause/resume`, `step list/view/add/delete`, `param list/get/set/delete`, `settings list/get/set` |
| Projects  | `project list`, `view`, `create`, `tree`, `param`, `token put/get`, `settings export/status`      |
| VCS/Conn  | `project vcs list/view/create/delete`, `project connection list/create/authorize/delete`          |
| Queue     | `queue list`, `approve`, `remove`, `top`                                                          |
| Agents    | `agent list`, `view`, `enable/disable`, `authorize/deauthorize`, `exec`, `term`, `reboot`, `move` |
| Pools     | `pool list`, `view`, `link/unlink`                                                                |
| Pipelines | `pipeline list`, `view`, `create`, `validate`, `pull`, `push`, `schema`, `delete`                 |
| API       | `teamcity api <endpoint>` - raw REST access                                                       |
| Link      | `teamcity link` - bind repo via `teamcity.toml`                                                   |

## Quick Workflows

See [Workflows](references/workflows.md) for full details on each.

- __Investigate failure__: `run list --status failure` -> `run log <id> --failed --raw` -> `run tests <id> --failed`
- __Debug build chain__: `run tree <id>` -> drill to deepest failed child
- __Fix and verify__: edit -> push -> `run start --watch` (use `--local-changes` for personal builds)
- __Pipeline lifecycle__: `pipeline pull <id>` -> edit -> `pipeline validate` -> `pipeline push <id>`, `pipeline schema` to get the actual schema from the server
- __GitHub VCS__: `connection create github-app` -> `connection authorize` -> install App on repo -> `vcs create --auth token --connection-id <id>`
- __Docker registry__: `echo $TOKEN | connection create docker -p <id> --name X --url https://ghcr.io --username U --stdin`

## References

- [Command reference](references/commands.md) - all commands and flags
- [Workflows](references/workflows.md) - failure investigation, build chains, connections, pipelines
- [Output formats](references/output.md) - JSON, plain text, scripting
