# swift-lsp

Adds Swift definition lookup through SourceKit-LSP.

## What It Does

Registers `swift_goto_definition(file, line, column?)`. The tool starts `sourcekit-lsp` on demand, opens the target Swift file over the Language Server Protocol, and asks SourceKit for symbol definitions. If `column` is omitted, the tool checks the Swift identifiers on the requested line and returns any external definitions it can resolve.

Relative file paths are resolved from the active Cline workspace. Absolute paths are accepted only when they stay inside that workspace.

## Install

```bash
cline plugin install swift-lsp
```

For local development from this repository:

```bash
cline plugin install ./plugins/swift-lsp --cwd .
```

## Requirements

- A Swift workspace.
- `sourcekit-lsp` available on `PATH`, usually from Xcode or the Swift toolchain.
- Set `SOURCEKIT_LSP=/absolute/path/to/sourcekit-lsp` if the binary is not on `PATH`.

## Security Notes

The tool starts the local `sourcekit-lsp` binary only when called and reads Swift project files through the language server. Use normal workspace trust rules before enabling it on untrusted projects.
