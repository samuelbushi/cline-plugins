---
name: logfire-query
description: Query and analyze Logfire traces, logs, spans, metrics, exceptions, SQL results, and root-cause evidence. Use for Logfire telemetry search, metrics questions, production debugging, and adding programmatic Logfire query code.
---

# Logfire Query

Use this skill when the user wants telemetry analysis in chat.

Do not use this skill just to open a Logfire page or produce a browser link. Use `logfire-ui` for direct UI or link requests. If the user says "show" or "view" and the intent is unclear, ask whether they want chat analysis or a Logfire UI view.

## Interactive MCP Queries

Use Logfire MCP tools when they are connected and authenticated. Cline should authenticate the remote MCP server through its MCP auth flow. If MCP auth is unavailable in the current surface, the user may need to configure a Logfire API key as a Bearer header outside this plugin.

Before querying, identify:

- Project or organization when not obvious.
- Time range.
- Service, endpoint, trace id, span name, error type, or deployment environment.
- Whether the user wants analysis, counts, comparison, or a specific record.

Write bounded SQL:

- Always include `LIMIT`.
- Start with narrow time ranges.
- Filter by `start_timestamp`, service, route, trace id, span name, or exception fields when possible.
- Use JSON attribute access with `attributes->>'key'`.
- Prefer project and time parameters from MCP tools when available.

Common query patterns:

```sql
SELECT start_timestamp, message, exception_type, exception_message
FROM records
WHERE is_exception
  AND start_timestamp >= now() - interval '1 hour'
ORDER BY start_timestamp DESC
LIMIT 20
```

```sql
SELECT span_name, duration, start_timestamp, message
FROM records
WHERE duration > 1.0
  AND start_timestamp >= now() - interval '1 hour'
ORDER BY duration DESC
LIMIT 20
```

```sql
SELECT service_name, count(*) AS error_count
FROM records
WHERE is_exception
  AND start_timestamp >= now() - interval '1 hour'
GROUP BY service_name
ORDER BY error_count DESC
LIMIT 20
```

## Schema Basics

Useful `records` columns:

- `start_timestamp`, `end_timestamp`, `duration`
- `trace_id`, `span_id`, `parent_span_id`
- `span_name`, `message`, `level`, `kind`, `service_name`
- `is_exception`, `exception_type`, `exception_message`, `exception_stacktrace`
- `attributes`, `tags`, `http_method`, `http_route`, `http_response_status_code`

Useful `metrics` columns:

- `recorded_timestamp`, `metric_name`, `metric_type`, `unit`
- `scalar_value`, `service_name`, `attributes`

## Programmatic Query Code

For code that queries Logfire, use a read token and store it in an environment variable such as `LOGFIRE_READ_TOKEN`. Never hardcode read tokens.

Python options:

- `LogfireQueryClient` for simple synchronous queries.
- `AsyncLogfireQueryClient` for async applications.
- `logfire.db_api` for DB-API and data tools.

REST option:

- `POST https://logfire-us.pydantic.dev/v2/query`
- `POST https://logfire-eu.pydantic.dev/v2/query`
- `Authorization: Bearer <read_token>`
- JSON body with a `query` field and optional query parameters

## Reporting Results

Lead with the answer. Include just enough rows or fields to support it. For debugging, connect telemetry evidence to concrete code or config changes. Offer a focused next query when the result is incomplete.
