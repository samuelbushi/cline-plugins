# pyright-lsp

Pyright diagnostics for Python workspaces.

## What It Does

Registers a `pyright_diagnostics` tool that runs the user-installed `pyright` CLI against a Python file or directory inside the current workspace. It returns Pyright's structured diagnostics with 1-based line and column positions so Cline can inspect type errors without a persistent language-server session.

## Install

```bash
cline plugin install pyright-lsp
```

For local development from this repository:

```bash
cline plugin install ./plugins/pyright-lsp --cwd .
```

## Example Usage

After installation, ask Cline:

```text
Run Pyright on the Python package and explain the highest-priority type errors.
```

## Requirements

- `pyright` available on `PATH` in the environment running Cline.
- A Python workspace with files or directories to check.
- Any project-specific Pyright configuration belongs in the user's workspace, such as `pyrightconfig.json` or `pyproject.toml`.

## Security Notes

The tool only runs `pyright --outputjson` against a path inside the current workspace. It does not install Pyright, start an LSP server, run Python code, access paths outside the workspace, register MCP servers, or make network calls.
