# gopls-lsp

Adds Go diagnostics through the local `gopls` language server.

## What It Adds

This plugin registers `gopls_check`, a Cline tool that runs `gopls check` for one `.go` source file inside the current workspace. It returns diagnostics, command output, and setup errors as structured data so Cline can explain what is wrong without launching a long-running language server process.

This is a bounded local diagnostics tool, not a persistent LSP client. It is useful when Cline needs Go type, compiler, or package diagnostics for a specific file before editing or reviewing Go code.

## Requirements

- Go project files in the current workspace.
- `gopls` installed and available on `PATH`.

Install `gopls` with:

```bash
go install golang.org/x/tools/gopls@latest
```

Ensure `$GOPATH/bin` or `$HOME/go/bin` is on `PATH`.

## Trust Boundary

The plugin itself does not call a network service. It invokes the local `gopls` binary, which reads and analyzes the workspace Go project using the user's local Go environment. Use it on Go workspaces you trust.
