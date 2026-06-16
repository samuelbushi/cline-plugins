# ruby-lsp

Adds bounded Ruby syntax diagnostics for Cline.

## What It Does

Registers `ruby_diagnostics(file)`. The tool checks Ruby workspace files with the user's installed Ruby tooling:

- `.rb`, `.rake`, `.gemspec`, and `.ru` files run through `ruby -c`.
- Common Ruby basenames like `Rakefile`, `Gemfile`, `Guardfile`, and `Capfile` also run through `ruby -c`.
- `.erb` files run through `erb -x` and then `ruby -c`.

This is a Cline-native diagnostic tool rather than a persistent language-server session.

## Install

```bash
cline plugin install ruby-lsp
```

For local development from this repository:

```bash
cline plugin install ./plugins/ruby-lsp --cwd .
```

## Example Usage

After installation, ask Cline:

```text
Check this Ruby file for syntax diagnostics before I commit it.
```

Cline can call `ruby_diagnostics` when it needs a bounded Ruby parse check instead of relying only on text search.

## Requirements

- Ruby 3.0 or later available as `ruby`.
- For `.erb` files, the `erb` executable available on `PATH`.
- The file being checked must be inside the active workspace.

## Security Notes

The tool does not install gems, start a language server, or intentionally execute Ruby application code. It runs the `ruby` and `erb` executables available on the plugin host's `PATH`, passes arguments without shell interpolation, caps captured output, and only accepts files inside the active workspace.
