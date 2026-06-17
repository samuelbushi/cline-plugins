---
name: "business-data"
description: "Use Windsor.ai business data connectors for marketing analytics, CRM, sales, ecommerce, finance, and dashboard/reporting workflows."
disable-model-invocation: false
---

# Windsor.ai Business Data Skill

Use this skill when the user explicitly asks to use Windsor.ai, asks about connected Windsor.ai sources, or asks to query data from accounts already connected through Windsor.ai. Do not infer Windsor.ai usage from a generic dashboard, report, CRM, ecommerce, finance, or analytics request without first asking whether the user wants to use Windsor.ai.

Do not query connected accounts, pull data, write files, generate fixtures from real data, or persist exports unless the user has explicitly asked for that Windsor.ai workflow. Treat returned business metrics, CRM records, ecommerce transactions, financial data, and account IDs as sensitive business data.

## When to Use

- User asks to use Windsor.ai for a dashboard, report, data visualization, integration, or data export
- User asks about ad spend, campaign performance, ROAS, CTR, CPC, or conversion metrics from Windsor.ai-connected accounts
- User asks to inspect Windsor.ai connectors, accounts, fields, or available data sources
- User asks to build code against Windsor.ai connector schemas
- User asks to create fixtures or seed data from Windsor.ai; prefer synthetic or anonymized fixtures, and use real records only after explicit approval

## Available Tools

Windsor.ai provides 4 MCP tools through the plugin-owned `windsor-ai` MCP server:

### `get_connectors`
Lists all connected platforms and their account IDs. Always call this first if you don't know what accounts are available.

### `get_options`
Returns available fields, date filters, and options for a specific connector. Use this to discover what data can be queried before calling `get_data`.

Parameters:
- `connector` (required): Platform ID like `"google_ads"`, `"facebook"`, `"tiktok"`, `"linkedin"`, `"googleanalytics4"`, `"hubspot"`, `"salesforce"`, `"searchconsole"`, `"instagram"`, `"youtube"`, `"google_my_business"`, `"shopify"`, `"stripe"`, `"quickbooks"`, and 300+ more
- `accounts` (required): List of account IDs from `get_connectors`

### `get_fields`
Returns detailed metadata about specific fields - data types, descriptions, available values. Use this when you need to understand the schema before writing code that processes the data.

Parameters:
- `connector` (required): Platform ID
- `fields` (required): List of field IDs like `["campaign", "spend", "clicks"]`

### `get_data`
Retrieves actual data. This is the main query tool.

Parameters:
- `connector` (required): Platform ID
- `accounts` (required): List of account IDs
- `fields` (required): Fields to retrieve, e.g. `["campaign", "date", "spend", "clicks", "impressions"]`
- `date_from` / `date_to`: Date range as `"YYYY-MM-DD"`
- `date_preset`: Shorthand like `"last_7d"`, `"last_30d"`, `"this_month"`, `"last_3m"`
- `filters`: Conditions like `[["spend", "gt", 100], "and", ["campaign", "contains", "Sale"]]`
- `options`: Connector-specific options like `{"attribution_window": "7d_view,1d_click"}`

## Workflow Pattern

1. Discover: Call `get_connectors` to see what's connected.
2. Explore: Call `get_options` to see available fields for a connector.
3. Understand: Call `get_fields` for field metadata if building typed interfaces.
4. Query: Call `get_data` only after the connector, account, fields, date range, and intended output are clear. Default to aggregate metrics and non-PII fields.
5. Confirm writes: Before saving queried data, generated fixtures, seed files, dashboard payloads, or TypeScript types into the workspace, summarize the destination path and get user approval.
6. Protect outputs: Prefer synthetic/anonymized fixtures. If real records are required, ask first, keep files out of commits by default, and suggest adding export/fixture paths to `.gitignore`.

## Common Field Patterns

Fields vary by connector type. Here are some common examples:

Marketing/Ads connectors: `campaign`, `adgroup`, `ad`, `date`, `device`, `country`, `spend`, `clicks`, `impressions`, `conversions`, `revenue`, `ctr`, `cpc`, `cpm`, `roas`

CRM connectors: `deal`, `contact`, `company`, `stage`, `owner`, `amount`, `close_date`

Ecommerce connectors: `order_id`, `product`, `quantity`, `price`, `status`. Treat customer/contact/order-level rows as sensitive row-level data; fetch them only when the user explicitly asks for that level of detail.

Always check `get_options` first since available fields vary by connector.

## Tips

- When building dashboards or charts, pull small aggregate previews with `get_data`, show the preview, and ask before writing local JSON/CSV files the app can read
- For TypeScript projects, use `get_fields` to generate accurate type definitions
- Use `date_preset` for quick queries: `"last_7d"`, `"last_30d"`, `"this_month"`
- Combine filters for focused queries: `[["spend", "gt", 0], "and", ["campaign", "ncontains", "test"]]`
- You can join data from different connectors (e.g. ad spend + CRM revenue) by pulling from each and merging in code
