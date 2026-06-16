---
name: apollo-analytics
description: Answer supported Apollo sales performance questions from available analytics data, including sequence, email, engagement, rep, team, and time trend dimensions when Apollo MCP exposes them.
---

# Apollo Analytics

Use this skill when the user asks for sales performance reporting from Apollo. Apollo analytics tool coverage can vary by workspace, plan, and MCP schema, so discover the available schema first and answer only with supported metrics and dimensions.

## Workflow

1. Identify the business question, audience, date range, and whether the user wants a flat answer, ranking, trend, or grouped table.
2. Use Apollo MCP to discover available analytics tools, schemas, metrics, users, teams, sequences, and dimensions before choosing a query.
3. Select the smallest useful metric set. Include rates alongside raw counts when the user asks about performance.
4. Apply the right time range. Default to the last 30 days when the user gives no range.
5. Add grouping only when the discovered schema supports it, such as by rep, team, sequence, engagement attribute, day, week, or month.
6. Run one focused query first. If the question spans unrelated dimensions, run separate queries rather than forcing one oversized report.
7. Validate the result for missing permissions, partial periods, low volume, and obvious outliers before drawing conclusions.

## Output

- Lead with the answer, not the query details.
- Use compact tables for grouped results.
- Convert decimals to readable percentages and format large numbers with commas.
- Call out the top outlier, lowest performer, trend break, or biggest gap when relevant.
- Include the date range, grouping, and any major caveats.
- Offer one or two useful follow-up actions such as drilling into a sequence, comparing supported team or rep dimensions, or refining the time range.

Do not export raw prospect or customer-level data unless the user explicitly asks and the workspace is appropriate for that data.
