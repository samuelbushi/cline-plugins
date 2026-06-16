---
name: exploring-data-catalog
description: Inventory and audit AWS Glue Data Catalog assets across default Glue, S3 Tables, Redshift-federated, and remote Iceberg catalogs without running data queries.
---

# Exploring Data Catalog

Use this skill for read-only catalog inventory: databases, tables, catalog types, locations, owners, freshness signals, and obvious governance gaps. For a specific unknown table, use the asset-finding skill.

Safety rules:

- Confirm scope before making API calls: full account catalog, one catalog, one database, or one search term.
- Do not run data queries or sample table rows in this skill. Use the querying skill for that.
- Paginate list calls until completion, but stop or narrow scope if the result set is too large.
- Treat catalog names, S3 paths, schemas, table comments, account IDs, and location metadata as sensitive.
- For AWS MCP documentation lookups, reduce the request to a sanitized docs question. For live AWS MCP API calls, send only the minimum approved identifiers and payload needed for the requested operation. Do not include secrets, unneeded account IDs, customer data, private code, log payloads, billing details, or confidential architecture.

Workflow:

1. Ask for region and scope. Explain whether the workflow is metadata-only.
2. Verify AWS MCP or AWS CLI availability and credentials only after user approval.
3. List Glue catalogs with recursive and root inclusion when doing a landscape view.
4. Classify catalogs as default Glue, S3 Tables, Redshift-federated, or remote Iceberg.
5. Enumerate databases and tables for the approved scope, handling pagination.
6. Capture useful metadata: table type, location, partition keys, parameters, update time, owner, and catalog path.
7. Summarize counts by catalog type and flag stale tables, missing locations, suspicious duplicate names, unpartitioned large tables, and unmanaged external locations.
8. Recommend next steps, such as using the asset-finding skill for a particular dataset or the querying skill for bounded profiling.

Do not broaden from metadata inventory into query execution without a clear user request and confirmation.
