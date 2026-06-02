# linear

Bundle the Linear SDK scripting skill as an installable Cline plugin.

## What It Does

Installs the `linear-sdk-scripting` skill. The skill guides agents through Linear work from the terminal by writing small Node scripts against the official `@linear/sdk`, including reading, creating, updating, closing, and commenting on issues.

## Install

```bash
cline plugin install linear
```

For local development from this repository:

```bash
cline plugin install ./plugins/linear --cwd .
```

## Requirements

- Node 18 or newer for the scripts the skill creates.
- A Linear personal API key in `LINEAR_API_KEY` when executing Linear actions.
- The skill handles installing `@linear/sdk` into a cache working directory when needed.

## Security Notes

Linear API keys are secrets. The bundled skill tells agents not to print, commit, or persist keys without explicit user approval.
