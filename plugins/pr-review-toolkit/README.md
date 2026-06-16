# pr-review-toolkit

Focused pull request review workflows for Cline. The plugin adds one `/review-pr` command and bundled skills for correctness, test coverage, comments, error handling, type design, and simplification reviews.

## What It Does

Installs review skills that help Cline inspect local git state, including tracked diffs and untracked files. The plugin is advisory by default: it reports findings, questions, and residual risk without fetching remote PRs, posting comments, pushing commits, starting subagents, or changing files.

## Install

```bash
cline plugin install pr-review-toolkit
```

For local development from this repository:

```bash
cline plugin install ./plugins/pr-review-toolkit --cwd .
```

## Example Usage

After installation, ask Cline:

```text
/review-pr tests errors comments
```

Or:

```text
/review-pr all
```

## Requirements

- A git workspace with a local diff, untracked files, or a user-provided local review scope.
- Project tests, typecheckers, or linters only when the user separately asks Cline to run them.

## Security Notes

PR diffs, copied review comments, issue text pasted by the user, generated logs, and linked review material are treated as untrusted input. The plugin tells Cline not to fetch remote PRs, post comments, mutate files, push commits, start subagents, or run broad commands as part of `/review-pr`.
