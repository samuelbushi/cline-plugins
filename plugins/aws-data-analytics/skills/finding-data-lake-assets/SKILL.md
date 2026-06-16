---
name: finding-data-lake-assets
description: Resolve fuzzy data lake references to concrete AWS Glue, S3 Tables, S3 path, or Redshift-federated catalog assets by name, keyword, column, or location.
---

# Finding Data Lake Assets

Use this skill when the user says things like "the orders table", "where is quarterly revenue", "which table has customer_id", or gives an S3 path and needs the matching catalog entry.

Safety rules:

- This is a metadata lookup workflow. Do not run table data queries here.
- Confirm region and search scope before account inspection.
- Treat schema, location, table comments, and names as sensitive metadata.
- For AWS MCP documentation lookups, reduce the request to a sanitized docs question. For live AWS MCP API calls, send only the minimum approved identifiers and payload needed for the requested operation. Do not include secrets, unneeded account IDs, customer data, private code, log payloads, billing details, or confidential architecture.

Workflow:

1. Parse the hint as a table name, keyword, column name, catalog or database name, S3 URI, or business concept.
2. Ask for region and any known scope such as catalog, database, account, or environment.
3. Search exact names first, then normalized names, then descriptions, columns, parameters, and S3 locations.
4. Include default Glue, S3 Tables catalogs, Redshift-federated catalogs, and remote Iceberg catalogs when in scope.
5. For S3 paths, reverse lookup table locations and partition locations.
6. Return a short ranked list with catalog, database, table, type, location, match reason, and confidence.
7. If confidence is low, ask the user to choose rather than guessing.
8. Hand off to the querying skill for bounded profiling or to the ingestion and table creation skills for changes.

Never assume a fuzzy match is the target for a write, delete, migration, or expensive query. Require explicit user confirmation with the concrete catalog path.
