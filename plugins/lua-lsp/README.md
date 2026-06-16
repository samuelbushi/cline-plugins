# lua-lsp

Adds Lua diagnostics through the Lua Language Server command line diagnosis report.

## What It Does

Registers `lua_diagnostics(path, checkLevel)`. The tool runs `lua-language-server --check` against a workspace directory and returns the parsed `check.json` report when LuaLS writes one.

This is a Cline-native diagnostic tool, not a persistent editor LSP session.

## Install

```bash
cline plugin install lua-lsp
```

For local development from this repository:

```bash
cline plugin install ./plugins/lua-lsp --cwd .
```

## Example Usage

After installation, ask Cline:

```text
Check this Lua project with LuaLS and summarize the diagnostics.
```

## Requirements

- A Lua workspace directory containing `.lua` files.
- `lua-language-server` available on `PATH`.
- Optional LuaLS configuration such as `.luarc.json` in the checked workspace.

## Security Notes

The tool only checks real directory paths inside the current workspace. It runs the local `lua-language-server` binary and reads a capped generated diagnosis report from a temporary directory.
