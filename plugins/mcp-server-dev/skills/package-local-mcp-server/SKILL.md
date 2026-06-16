---
name: package-local-mcp-server
description: Package or distribute a local MCP server that must access local files, localhost services, desktop apps, hardware, or OS APIs.
---

# Package Local MCP Server

Use this skill when the user wants to ship a local MCP server, bundle an MCP runtime, make a server installable for non-developers, discuss MCPB files, or distribute a server that must run on the user's machine.

Local packaging is the exception, not the default. If the server only calls a cloud API, use a remote streamable HTTP MCP server instead.

## Choose The Distribution Shape

Use:

- Cline plugin package when the target audience is Cline users and the server can be installed as a plugin-owned local stdio MCP server.
- Documented local stdio command when the server is personal, experimental, or tied to a repository.
- Host-specific bundle format only when the target host supports that format and users need one-file installation without Node, Python, or a project checkout.

Do not imply that a bundle format works in Cline unless Cline supports installing that format. Keep host-specific instructions clearly labeled.

## Security Model

A local MCP server runs with the user's local privileges. Treat it like desktop software:

- Validate and normalize every path.
- Restrict filesystem access to configured roots.
- Allowlist spawned commands and arguments.
- Avoid shell interpolation.
- Do not read browser profiles, keychains, SSH keys, or credential files unless the user explicitly requested that integration.
- Store tokens in OS keychain or the host's sensitive secret storage when available. Never plaintext.
- Log operation summaries, not secrets or full user data.

## Packaging Steps

1. Confirm why the server must be local.
2. Identify required runtime: Node, Python, binary, or mixed.
3. Bundle only production files and dependencies.
4. Use bundle-relative paths for server entrypoints.
5. Keep user configuration separate from bundled code.
6. Validate the package manifest or installer metadata.
7. Run the packaged server through a local MCP inspector or the target host.
8. Document exact permissions, local paths, environment variables, and uninstall behavior.

## Cline Plugin Path

For a Cline-native local server, prefer a plugin package that installs the server dependency and registers one stdio MCP server from `index.ts`.

The plugin should:

- Register a single clear MCP server name.
- Set the stdio command and args to plugin-owned files or package binaries.
- Avoid duplicate local and remote variants unless users genuinely need both.
- Avoid install-time network calls beyond normal package dependency installation.
- Explain how users disable or uninstall the plugin-owned server.

## Host-Specific Bundle Path

If the user asks for a host-specific local bundle such as MCPB:

- Check that the target host currently supports the bundle format.
- Read the current manifest schema before writing one.
- Make sensitive `user_config` fields explicit.
- Validate and pack with the format's own CLI.
- Test the bundled server as installed, not just the source server.

## Before Finishing

Verify:

- The local server cannot escape configured file roots by path traversal or symlink surprises.
- Write, delete, network, and command-execution tools are split from read-only tools.
- The package contains no `.env`, tokens, local caches, or test credentials.
- The documented install path matches the target host.
- The uninstall story is clear for generated files, configs, and local state.
