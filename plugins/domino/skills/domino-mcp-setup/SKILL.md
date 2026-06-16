---
name: domino-mcp-setup
description: Configure and troubleshoot the Domino MCP server in Cline. Use when installing the Domino plugin, checking uv/Python requirements, setting Domino credentials, or diagnosing missing Domino MCP tools.
---

# Domino MCP Setup

Use this skill when the user needs Cline connected to Domino through the bundled `domino` MCP server.

## Requirements

- `uv` must be on PATH.
- Python 3.11 or newer must be available to `uv`.
- The user needs access to a Domino Data Lab instance.

## Authentication modes

Inside a Domino workspace:

- The server detects `DOMINO_API_HOST`.
- It uses `http://localhost:8899/access-token` for short-lived bearer tokens.
- Project owner and project name can be auto-detected from Domino workspace environment variables.

Outside Domino:

- Start Cline with `DOMINO_HOST` set to the Domino base URL.
- Start Cline with `DOMINO_API_KEY` set to the user's API key.
- Do not persist API keys unless the user explicitly asks.
- Never print, commit, or echo the API key value.

## Quick checks

1. Check `uv --version`.
2. Check `python3 --version` or `uv python list`.
3. Ask the MCP tool `get_domino_environment_info` first when available.
4. If outside Domino and tools fail with missing env vars, ask the user to restart Cline from a shell where `DOMINO_HOST` and `DOMINO_API_KEY` are set.

## Trust boundaries

The MCP can launch remote Domino jobs and write files to DFS projects. Before calling a tool that starts a job, uploads content, or force-overwrites a remote file, summarize the exact target and wait for user confirmation unless the user already gave that exact instruction. Read local files through normal Cline file tools before sending explicit content to the Domino MCP.
