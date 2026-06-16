---
name: airtable-filters
description: Use this skill when building Airtable MCP filter objects for finding, narrowing, or searching records by field values.
---

# Airtable Filters

Use this skill to build Airtable filter parameters for MCP record queries.

## Filter Basics

- Read the table schema first.
- Use field IDs from the schema, not display names, when the tool expects IDs.
- Combine simple conditions with top-level AND unless the user asks for OR logic.
- Nest filter objects only when the logic needs mixed AND and OR groups.

## Field Rules

- Text fields can use equality, contains, does-not-contain, empty, and not-empty style operators.
- Numeric fields can use equality and range comparisons.
- Date fields should use explicit date objects or ranges and include timezone when the tool supports it.
- Single select and multiple select fields usually require choice IDs, not labels.
- Collaborator fields usually require collaborator or group IDs.
- Linked-record fields usually require linked record IDs.
- Attachment fields can filter by presence and, when supported, filename or file type.

## Workflow

1. Restate the user's intended filter in plain language.
2. Inspect schema to resolve field IDs and choice or collaborator IDs.
3. Build the smallest filter object that matches the intent.
4. If values are ambiguous, ask before querying.
5. Run the query with a reasonable limit first, then page only if needed.

Do not guess IDs. If schema or choice IDs are unavailable, fetch them before querying.
