# Terraform

Register the HashiCorp Terraform MCP server for Cline.

## What It Does

This plugin adds a local stdio MCP server named `terraform` using Docker and the pinned `hashicorp/terraform-mcp-server:0.4.0` image. The server gives Cline Terraform ecosystem context for Infrastructure as Code workflows.

The plugin also adds a Terraform safety rule so Cline starts with read-only discovery/planning, treats state and tokens as sensitive, and asks before infrastructure-changing actions.

## Install

```bash
cline plugin install terraform
```

For local development from this repository:

```bash
cline plugin install ./plugins/terraform --cwd .
```

## Requirements

- Docker available on the machine running Cline.
- Network access to pull `hashicorp/terraform-mcp-server:0.4.0` the first time the MCP server starts.
- `TFE_TOKEN` in the environment when Terraform Cloud or Terraform Enterprise access is needed.

## Security Notes

Terraform plans, state, variables, and Terraform Cloud tokens can expose infrastructure details and secrets. Review MCP tool calls before changing infrastructure, and do not commit or print sensitive values.
