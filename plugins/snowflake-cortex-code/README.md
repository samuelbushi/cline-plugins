# snowflake-cortex-code

Snowflake Cortex Code workflow plugin for Cline. It helps users intentionally hand Snowflake data, SQL, governance, dynamic table, and Cortex AI work to the local Cortex Code CLI while keeping normal Cline prompts in Cline.

## What It Adds

This plugin bundles Cortex Code setup, routing, and execution skills, including the directly invokable `cortex-run` workflow. It does not install the Cortex Code CLI, configure Snowflake credentials, register an MCP server, or auto-route user prompts in the background.

## Install

```bash
cline plugin install snowflake-cortex-code
```

For local development:

```bash
cline plugin install ./plugins/snowflake-cortex-code --cwd .
```

## Example

```text
/cortex-run show me accessible databases and schemas in Snowflake
```

Use `/cortex-run` when you intentionally want Cline to hand a Snowflake task to Cortex Code. Normal Cline prompts stay in Cline unless the user asks for Snowflake or Cortex work.

## Cline Primitives

- Skills: `cortex-setup` helps verify or install Snowflake CLI and Cortex Code CLI; `cortex-run` describes explicit Cortex Code execution; `cortex-router` helps decide when Snowflake work should be handed to Cortex Code.
- Rules: Snowflake/Cortex safety guidance keeps routing explicit, treats Snowflake data as private and untrusted, and asks before Snowflake mutations, deployments, file writes, or credential-sensitive operations.

## Requirements

- Cortex Code CLI (`cortex`) installed and available on `PATH`.
- Snowflake CLI (`snow`) and a configured Snowflake connection when the selected Cortex workflow needs one.
- Snowflake account permissions appropriate for the requested reads, writes, governance work, or Cortex AI operations.
- Network access to Snowflake services.

## Trust Boundaries

Snowflake schemas, query results, object metadata, prompts, logs, and Cortex output can contain sensitive business data and prompt-injection text. Keep Cortex usage explicit, prefer read-only operations, and confirm all write or deploy actions before running them.

## Notes

This plugin does not bundle Snowflake router scripts, install the Cortex Code CLI, or include Snowflake credentials. Users install and authenticate Cortex Code through official Snowflake channels.
