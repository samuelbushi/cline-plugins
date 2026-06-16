# clangd-lsp

Adds C/C++ diagnostics through the local clangd language server.

## What It Does

Registers `clangd_check(file, compileCommandsDir?)`. The tool runs `clangd --check=<file>` against a C/C++ source or header file in the current workspace and returns clangd's diagnostic output without modifying files.

This is a Cline-native tool wrapper, not a persistent editor-style LSP session. It is useful when Cline needs compiler-aware C/C++ feedback before editing or explaining code.

## Install

```bash
cline plugin install clangd-lsp
```

For local development from this repository:

```bash
cline plugin install ./plugins/clangd-lsp --cwd .
```

## Example Usage

After installation, ask Cline:

```text
Run clangd diagnostics for src/parser.cpp and explain the highest-priority issues.
```

## Requirements

- `clangd` available on `PATH`.
- A C or C++ workspace.
- `compile_commands.json` when the project needs custom include paths, defines, or compiler flags.

## Security Notes

The tool runs the local `clangd` executable on a user-selected workspace file and reads project files through clangd, including compile flags from the selected compile database when provided. It does not edit files or invoke a shell. Use normal workspace trust rules before enabling it on untrusted projects.
