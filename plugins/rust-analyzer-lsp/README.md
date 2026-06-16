# rust-analyzer-lsp

Adds bounded Rust diagnostics for Cline.

## What It Does

Registers `rust_diagnostics`. The tool finds a Cargo manifest from a Rust file, crate directory, or `Cargo.toml`, then runs local `cargo check --message-format=json` and returns structured compiler diagnostics.

This is a Cline-native adaptation of Rust language-server support. Cline does not yet expose a generic persistent LSP plugin primitive, so this plugin provides the most useful low-surprise diagnostic workflow through the user's local Rust toolchain.

## Install

```bash
cline plugin install rust-analyzer-lsp
```

For local development from this repository:

```bash
cline plugin install ./plugins/rust-analyzer-lsp --cwd .
```

## Example Usage

After installation, ask Cline:

```text
Run Rust diagnostics for this crate and summarize the compiler errors.
```

## Requirements

- A Rust workspace with a `Cargo.toml`.
- Cargo on PATH. Installing Rust through `rustup` is the usual setup path.
- Dependencies already available locally because the tool always uses `--offline`.
- A current `Cargo.lock` because the tool always uses `--locked`.

## Security Notes

The tool executes `cargo check` inside the workspace. Cargo may run build scripts and procedural macros from the project and its dependencies; that project code may read files, write files, or open network connections.

The tool always uses `--offline` and `--locked` so Cargo itself will not fetch dependencies or update `Cargo.lock`. These flags are not a sandbox. Use this plugin only in trusted Rust workspaces.
