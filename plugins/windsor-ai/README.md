# Windsor.ai

Windsor.ai gives Cline access to connected business data sources for marketing analytics, CRM, ecommerce, finance, sales, reporting, dashboards, and data-integration work. It can help inspect available connectors, query campaign and revenue data, generate TypeScript types from live schemas, and shape data for apps or reports.

## Cline Primitives

- MCP: registers the remote `windsor-ai` Streamable HTTP MCP server at `https://mcp.windsor.ai`, exposing connector discovery, field/schema inspection, and data query tools.
- Skill: `business-data` guides Cline through Windsor.ai workflows: discover sources, inspect options and fields, query data, join connector results, and integrate results into code with explicit write approval.
- Commands: `/campaign-report`, `/windsor-sources`, and `/windsor-types` provide quick entry points for common reporting, source-discovery, and TypeScript schema workflows.
- Rule: `windsor-ai:business-data-safety` treats connected account metadata, business metrics, CRM records, ecommerce orders, finance data, and exports as sensitive business data.

## Requirements

Users need a Windsor.ai account with connectors already configured. The remote MCP server may require authorization before tools are available in Cline.

The plugin does not run local setup, install dependencies, or query Windsor.ai during installation. Broad queries, all-source exploration, large date ranges, and file writes are intentionally gated behind user intent and approval.
