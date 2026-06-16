---
name: querying-data-lake
description: Build, classify, execute, and troubleshoot Athena SQL queries across Glue, S3 Tables, and federated catalogs with workgroup selection and cost awareness.
---

# Querying Data Lake

Use this skill when the user wants to run SQL, profile a table, inspect Athena workgroups, or analyze data in AWS data lake catalogs.

Safety rules:

- Ask before executing any live query, changing workgroups, setting output locations, or running non-read SQL.
- Treat `SELECT`, `SHOW`, `DESCRIBE`, and `EXPLAIN` as read-only but still confirm output location and scope for non-trivial queries.
- Treat `INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`, `CREATE`, `TRUNCATE`, and `MERGE` as destructive or cost-bearing. Require explicit confirmation.
- Add limits or partition filters for exploration. Warn about cross-catalog joins and Redshift-federated scans.
- Treat result rows, schemas, S3 output paths, query text, and errors as sensitive.
- For AWS MCP documentation lookups, reduce the request to a sanitized docs question. For live AWS MCP API calls, send only the minimum approved identifiers and payload needed for the requested operation. Do not include secrets, unneeded account IDs, customer data, private code, log payloads, billing details, or confidential architecture.

Workflow:

1. Confirm region, catalog, database, workgroup, output location, and whether raw SQL or a business question was provided.
2. Verify AWS MCP or AWS CLI availability and credentials only after user approval.
3. Resolve fuzzy table references with the asset-finding skill. Do not guess a table for query execution.
4. Select and show the Athena workgroup before starting any query.
5. For unfamiliar tables, run bounded profiling: schema, partitions, small samples, row count estimates, and relevant min or max values.
6. Build SQL with correct catalog qualification for default Glue, S3 Tables, registered sources, and Redshift-federated catalogs.
7. Classify the SQL statement and get confirmation when required.
8. Execute through AWS MCP when available, or `aws athena` CLI when MCP is unavailable. Capture query ID, status, data scanned, duration, and result location.
9. Present concise results, cost context, and next-step queries or changes.

Never fall back to shelling into databases directly for this workflow. Keep execution through AWS MCP or the AWS CLI so workgroup and output tracking remain visible.
