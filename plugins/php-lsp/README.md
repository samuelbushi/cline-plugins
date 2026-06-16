# php-lsp

Adds bounded PHP diagnostics for Cline.

## What It Does

Registers `php_diagnostics(target, maxFiles)`. The tool runs `php -l` against one PHP file or a capped set of PHP files under a directory, returning syntax-only diagnostics without starting a persistent language server.

This adapts PHP language-server style support into the current Cline plugin system, where a bounded diagnostics tool is more reliable than a background LSP process. It does not provide completions, goto definition, or type analysis.

## Install

```bash
cline plugin install php-lsp
```

For local development from this repository:

```bash
cline plugin install ./plugins/php-lsp --cwd .
```

## Example Usage

After installation, ask Cline:

```text
Check the PHP files I changed for syntax errors before I commit.
```

Cline can call `php_diagnostics` on a changed PHP file or a relevant directory.

## Requirements

- PHP available on `PATH`.
- A PHP workspace with `.php` files.

## Security Notes

The tool only runs `php -l` against files inside the workspace. Directory scans skip common dependency and build folders such as `vendor`, `node_modules`, `.git`, `dist`, `build`, and `coverage`.
