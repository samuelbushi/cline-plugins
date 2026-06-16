# airtable

Airtable database and operations support for Cline.

## What It Adds

This plugin registers the `airtable` MCP server at:

```text
https://mcp.airtable.com/mcp
```

It also bundles eight Airtable skills:

- `airtable-overview`: explain bases, tables, fields, records, views, automations, and interfaces.
- `airtable-records`: use Airtable MCP tools for safe schema and record work.
- `airtable-filters`: build field-aware filter objects for Airtable record queries.
- `airtable-link`: return useful Airtable links after visible changes or lookups.
- `airtable-agent-activity-log`: add an opt-in activity log table for agent-driven workflows.
- `airtable-product-ops`: shape roadmap, feedback, release, and product planning bases.
- `airtable-marketing-ops`: shape campaign, content, asset, creative, and launch workflows.
- `airtable-sales-ops`: shape CRM, pipeline, deal desk, renewal, and partner workflows.

## Install

```bash
cline plugin install airtable
cline config mcp
cline config skills
```

For local development from this repository:

```bash
cline plugin install ./plugins/airtable --cwd .
```

## Example Usage

After installation, ask Cline:

```text
Use Airtable to list the tables in my product roadmap base.
```

```text
Build an Airtable CRM shape for a small sales team.
```

```text
Filter Airtable records where Status is In progress and Due date is this month.
```

## Requirements

- Airtable account access.
- Authorization for the Airtable MCP server.
- Appropriate base, workspace, schema, and record permissions for the requested work.

## Security Notes

Airtable MCP tools can read and write real business data. Confirm destructive changes, bulk updates, and schema changes before running them. Never ask users to paste Airtable tokens into chat; use the MCP authorization flow or environment-specific credential handling provided by the host.
