# typescript-lsp

Adds TypeScript language service definition lookup.

## What It Does

Registers `goto_definition(file, line)`. The tool loads the workspace TypeScript project and resolves definitions using the TypeScript language service.

## Install

```bash
cline plugin install typescript-lsp
```

For local development from this repository:

```bash
cline plugin install ./plugins/typescript-lsp --cwd .
```

## Requirements

- A JavaScript or TypeScript workspace.
- The workspace should provide its own TypeScript dependency when needed.

## Security Notes

The tool reads project files through the language service. Use normal workspace trust rules before enabling it on untrusted projects.

