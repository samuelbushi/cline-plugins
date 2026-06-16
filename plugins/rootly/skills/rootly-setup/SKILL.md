---
name: rootly-setup
description: Set up the Rootly plugin. Verifies the MCP server connection and guides through lightweight project service mapping.
---


# Rootly Plugin Setup

You are running the first-time setup for the Rootly Cline plugin. Follow these steps in order:

## Step 1: Verify MCP Connection

First, test the MCP server connection by calling `mcp__rootly__get_server_version`.

- Succeeds: The MCP server is reachable. Continue to Step 2.
- Fails with 401 / OAuth prompt: Cline should automatically start the OAuth2 flow - a browser window will open for you to log in to Rootly and grant access. Once authorized, retry `mcp__rootly__get_server_version`.
- Fails with other error: MCP server connection issue. Check network connectivity to `https://mcp.rootly.com`.

## Step 2: Verify Authentication

Call `mcp__rootly__getCurrentUser` to confirm your identity.

- Succeeds: Authentication is working. Report the authenticated user and team, then continue to Step 3.
- Fails: Authentication issue. Provide troubleshooting:

> Authentication Troubleshooting
>
> This plugin uses OAuth2 by default - Cline handles the login flow automatically when it connects to the MCP server. No API token is needed for MCP commands.
>
> If OAuth2 is not working:
> 1. Ensure your Rootly organization has OAuth2 enabled
> 2. Try disconnecting and reconnecting the MCP server: the MCP settings view > find Rootly > disconnect > reconnect
> 3. Check that your browser can reach `https://rootly.com/oauth/authorize`
>
> This Cline plugin does not use Rootly API tokens, shell hooks, or direct REST fallbacks. Fix the MCP connection before continuing.

Then stop here - no further steps possible without working authentication.

## Step 3: Service Mapping Configuration

Check if `.cline/rootly-config.json` exists in the current project directory.

If the file does NOT exist, offer to create it:

1. Ask the user which Rootly service(s) correspond to this repository
2. Ask which team owns this service (optional)
3. Create `.cline/rootly-config.json` with the format:
   ```json
   {
     "services": ["service-name-1", "service-name-2"],
     "team": "team-name"
   }
   ```

If the file exists, read and display its current configuration.

## Step 4: Show Quick-Start Guide

Once setup is complete, display:

> Rootly plugin is ready!
>
> Authentication: OAuth2 (logged in as {user name})
>
> | Command | Description |
> |---------|-------------|
> | the `rootly-deploy-check` skill | Check deployment safety before pushing |
> | the `rootly-respond` skill [incident-id] | Investigate and respond to an incident |
> | the `rootly-oncall` skill | View on-call dashboard |
> | the `rootly-retro` skill [incident-id] | Generate post-incident retrospective |
> | the `rootly-status` skill | Service health overview |
> | the `rootly-ask` skill [question] | Ask questions about your incident data |
> | the `rootly-brief` skill [incident-id] | Generate stakeholder brief for executives |
> | the `rootly-handoff` skill [incident-id] | Prepare incident or on-call handoff docs |
>
> Automation note: this Cline plugin does not install shell hooks or register deployment events automatically. Use the Rootly skills explicitly when you want incident, on-call, deployment-risk, or retrospective help.
