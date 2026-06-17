# Zapier

Zapier connects Cline to actions across thousands of apps through Zapier MCP.

## Cline Primitives

- MCP: `zapier` registers the remote Zapier MCP server at `https://mcp.zapier.com/api/v1/connect`.
- Skills: `zapier-setup` guides first connection, reconnection, mode detection, and action selection.
- Skills: `zapier-status` checks health, audits duplicate actions, and diagnoses broken or missing tools.
- Skills: `zapier-tool-profile` creates user-approved project guidance after actions are configured so Cline knows which Zapier actions exist and when to use them.
- Rules: `zapier:safety` treats connected app content as untrusted data, allows reads when relevant, and requires explicit approval before writes.

## Requirements

- A Zapier account.
- MCP authorization through Cline after install.
- Connected Zapier app actions for the apps the user wants Cline to read from or write to.

## Install

```bash
cline plugin install zapier
```

For local development from this repository:

```bash
cline plugin install ./plugins/zapier --cwd .
```

After install, authorize the `zapier` MCP server through Cline's MCP flow.

## Example Usage

```text
/zapier-setup Help me connect Slack and Google Calendar actions.
/zapier-status Check my Zapier MCP setup.
/zapier-tool-profile Create project guidance for my configured Zapier actions.
```

## Trust Boundaries

The plugin does not store Zapier credentials, install dependencies, or call Zapier during installation. OAuth is handled by Cline MCP authorization. Zapier actions may read or mutate connected third-party apps at runtime, so write operations require explicit user confirmation.
