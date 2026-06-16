# mcp-tunnels

Adds a Cline slash command for setting up Anthropic MCP Tunnels with Docker Compose.

## What It Does

The plugin registers `/create-docker-mcp-tunnel [deployment-dir]`.

The command submits a guided setup prompt for the manual-credentials Docker Compose flow:

- Preflight Docker, Docker Compose, OpenSSL, and outbound connectivity.
- Guide the user through Anthropic Console actions they must do themselves.
- Generate local certificates and proxy configuration only after approval.
- Keep tunnel tokens out of chat by using a gitignored `.env` placeholder or user-exported environment variable.
- Route either an existing private MCP server or a tiny sample streamable HTTP server.
- Verify cloudflared registration, proxy logs, and the final tunnel URL.

## Install

```bash
cline plugin install mcp-tunnels
```

For local development from this repository:

```bash
cline plugin install ./plugins/mcp-tunnels --cwd .
```

## Requirements

- Docker and Docker Compose on the machine that will run the tunnel stack.
- OpenSSL for local CA and server certificate generation.
- Anthropic Console access with permission to manage MCP tunnels.
- Outbound access to the Anthropic API and tunnel edge. The flow does not require inbound ports on the origin.

## Trust Boundary

This plugin does not create tunnels, run Docker, generate certificates, or call external APIs at install time. The slash command is a runbook prompt; the actual setup happens only after the user asks for it and approves the relevant local actions.

Tunnel tokens, `.env` files, private keys, and generated certificate data should never be pasted into chat or committed to git.
