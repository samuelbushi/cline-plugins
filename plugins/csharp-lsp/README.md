# csharp-lsp

Adds local C# build diagnostics for Cline.

## What It Does

Registers `csharp_build_diagnostics`. The tool runs `dotnet build` against a workspace solution or project and returns compiler diagnostics. It defaults to `--no-restore` so invoking the tool does not implicitly fetch packages from the network.

This is a Cline-native adaptation of C# language-server support. Cline does not yet expose a generic persistent LSP plugin primitive, so this plugin provides the most useful low-surprise diagnostic workflow through the .NET SDK.

## Install

```bash
cline plugin install csharp-lsp
```

For local development from this repository:

```bash
cline plugin install ./plugins/csharp-lsp --cwd .
```

## Example Usage

After installation, ask Cline:

```text
Run C# diagnostics for this solution and summarize the compiler errors.
```

## Requirements

- A C# workspace with a `.sln`, `.slnx`, or `.csproj` file.
- .NET SDK 6.0 or later on PATH.
- Restored packages when using the default `--no-restore` behavior.

## Security Notes

The tool executes `dotnet build` inside the workspace. It does not modify source files, but normal .NET builds can write `bin/` and `obj/` outputs and execute build targets defined by the project. Use normal workspace trust rules before enabling it on untrusted projects.
