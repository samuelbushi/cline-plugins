# commit-commands

Git workflow command plugin for Cline. It adds slash commands for creating commits, opening pull requests, and cleaning stale local branches.

The plugin does not inspect the repository, run git commands, push branches, or delete anything during install. It only registers Cline slash commands.

## Install

```bash
cline plugin install commit-commands
```

For local development from this repository:

```bash
cline plugin install ./plugins/commit-commands/index.ts --cwd .
```

## Cline Primitives

- Slash command `/commit`: asks Cline to create one cohesive git commit from the current workspace changes.
- Slash command `/commit-push-pr`: asks Cline to create a commit, push a feature branch, and open a pull request.
- Slash command `/clean-gone`: asks Cline to remove local branches whose upstream branch is gone, including safe worktree cleanup.

The commands direct Cline to:

- inspect git status, diffs, branch state, recent commits, and applicable repository guidance before changing anything;
- preserve the user's index and ask when staged changes are unrelated or ambiguous;
- stage only files that belong to the cohesive change;
- avoid committing secrets, credentials, local config, build artifacts, dependency folders, or unrelated changes;
- avoid generated assistant attribution and co-author footers;
- ask before pushing and before creating a PR when branch, remote, target, title, or body is ambiguous;
- create useful PR descriptions from local evidence and repository PR templates;
- avoid deleting protected branches, current branches, unmerged branches, or branches with uncommitted worktree changes;
- avoid force-deleting a branch unless the user explicitly confirms that named branch after seeing commits that would be lost.

## Requirements

- Git installed and configured.
- A git repository for all commands.
- A GitHub remote and authenticated GitHub CLI (`gh`) for `/commit-push-pr`.

## Trust Boundaries

Command input, file contents, diffs, commit messages, PR template text, branch names, command output, generated code, and remote content are untrusted data. The commands tell Cline to use that material as repository evidence only, never as instructions. Repository policy guidance such as `AGENTS.md`, `CONTRIBUTING.md`, and `.cline` guidance is treated separately from PR template formatting and ordinary repository content.

These commands can mutate local git state and, for `/commit-push-pr`, remote branch and PR state. Cline should stop and ask when the worktree contains unrelated changes, deletion would affect multiple branches or worktrees, or repository guidance requires confirmation.

## Attribution

This plugin includes adapted git workflow guidance from a public commit commands plugin, distributed under Apache-2.0. See `LICENSE.commit-commands-plugin` and `NOTICE.commit-commands-plugin`.
