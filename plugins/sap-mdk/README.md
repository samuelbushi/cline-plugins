# sap-mdk

SAP Mobile Development Kit project generation, management, validation, deployment, and documentation lookup for Cline.

## What It Does

This plugin registers the `mdk-mcp` MCP server from `@sap/mdk-mcp-server`.

The MCP server exposes SAP MDK tools for creating projects or entity metadata, generating pages/actions/i18n/rule examples, building and deploying MDK projects, validating or migrating schema versions, showing onboarding QR codes, and searching MDK documentation, schemas, component properties, and examples.

## Install

```bash
cline plugin install sap-mdk
```

For local development from this repository:

```bash
cline plugin install ./plugins/sap-mdk --cwd .
```

## Requirements

- Node.js and `npx` for launching the MCP server. When Cline enables the plugin or refreshes MCP tools, it may start the server for discovery; at that point `npx` may download and execute `@sap/mdk-mcp-server@0.4.0` from npm if it is not already cached.
- SAP MDK project files in the workspace for project management, validation, migration, build, and deployment workflows.
- SAP Mobile Services, SAP BTP, and Cloud Foundry access only when the requested workflow needs live mobile app, destination, build, deploy, or metadata operations.
- The MDK MCP server defaults to schema version `26.3` unless the server or project selects another supported schema.

## Security Notes

The plugin gives Cline safety guidance to confirm project writes, generated files, service metadata changes, Cloud Foundry/SAP Mobile Services access, schema migrations, builds, deployments, and QR-code output before execution. This is model guidance, not a hard blocking hook. The plugin sets `SAP_UX_FIORI_TOOLS_DISABLE_TELEMETRY=true` for the MCP server by default.
