---
name: sonar-integrate
description: Set up SonarQube CLI authentication and verify the Cline SonarQube MCP integration. Use when the user wants to configure SonarQube, the MCP tools are unavailable, or SonarQube commands report missing auth.
---

# Integrate SonarQube With Cline

Use this skill to verify the local SonarQube CLI, guide authentication, and
confirm that this Cline plugin can start the SonarQube MCP server.

This plugin already registers the MCP server as `sonar run mcp`. Do not run
external agent integration commands unless the user explicitly asks to configure
another client.

## Step 1: Check SonarQube CLI

Check whether `sonar` is available:

```bash
command -v sonar && sonar --version
```

On Windows PowerShell:

```powershell
Get-Command sonar
sonar --version
```

If the CLI is missing, tell the user SonarQube CLI is required and direct them
to the official SonarQube CLI installation docs. If the user asks Cline to help
install it, first inspect official docs or user-provided installation
instructions, then show the exact command and wait for explicit approval. Do
not install or update software silently.

If `sonar` is present, do not update it automatically. If the user explicitly
asks to check for CLI updates, show the command and wait for approval before
running it:

```bash
sonar self-update
```

If it fails but `sonar` still works, continue with authentication checks.

## Step 2: Check Authentication

Run:

```bash
sonar auth status
```

If already authenticated, note the connected server or organization and proceed
to MCP verification.

If unauthenticated, ask the user which target they use:

- SonarQube Cloud EU
- SonarQube Cloud US
- SonarQube Server or Community Build

Build the appropriate login command:

| Target | Command |
|--------|---------|
| SonarQube Cloud EU | `sonar auth login -o <org-key>` |
| SonarQube Cloud US | `sonar auth login -o <org-key> -s https://sonarqube.us` |
| SonarQube Server | `sonar auth login -s <server-url>` |

Do not ask the user to paste tokens into chat. Tell them the browser login
stores credentials in the system keychain. Let the user run the login command,
then run `sonar auth status` again to verify.

## Step 3: Check Project Context

Look for project configuration:

```bash
test -f sonar-project.properties && sed -n '1,120p' sonar-project.properties
```

If no project key is configured, ask whether the user wants to use an explicit
project key for the current workflow. Do not create or edit
`sonar-project.properties` unless the user asks.

## Step 4: Verify MCP Readiness

This Cline plugin starts SonarQube MCP with:

```bash
sonar run mcp
```

Do not start long-running MCP processes manually unless you are debugging. To
verify prerequisites without launching a persistent server, use:

```bash
sonar auth status
sonar --version
```

If Cline does not show SonarQube MCP tools after install, tell the user to
restart the Cline session so the plugin-owned MCP server can start.

## Summary

When setup is complete, report:

```text
SonarQube integration is ready.

sonarqube-cli: available
Authentication: verified
MCP Server: registered by this Cline plugin as `sonar run mcp`
Next: restart the Cline session if SonarQube tools do not appear
```

If anything fails, show the failing command, the relevant error, and the next
manual corrective action. Do not invent fallback tools.
