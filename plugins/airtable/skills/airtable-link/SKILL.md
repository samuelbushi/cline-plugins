---
name: airtable-link
description: Use this skill after Airtable MCP calls that create, update, list, or return user-visible Airtable content.
---

# Airtable Link

Return one useful Airtable link after visible Airtable work.

## Rules

- Prefer explicit URLs returned by successful MCP calls.
- If the MCP response only includes IDs, build only conservative links whose shape is certain, such as workspace or base links.
- For table, view, page, interface, or record work without a returned URL, provide the best parent link and include the relevant IDs in text.
- Prefer the most specific useful surface.
- Use a markdown link with a descriptive label.
- Usually return one link, not one link per record.
- Do not invent IDs, view IDs, page IDs, URL paths, or query parameters.

## Conservative URL Shapes

```text
Workspace: https://airtable.com/workspaces/<wspId>
Base: https://airtable.com/<appId>
```

## Priority

1. Direct URL from MCP response for the changed or requested object.
2. Base link when work was scoped to a base.
3. Workspace link for workspace-level work.
4. Plain text IDs when no reliable URL is available.

If the user appears page-restricted, only return page or interface URLs that MCP calls explicitly returned.
