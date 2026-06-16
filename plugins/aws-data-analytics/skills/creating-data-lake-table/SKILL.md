---
name: creating-data-lake-table
description: Create managed Iceberg tables with Amazon S3 Tables, including table bucket, namespace, schema, partitioning, Glue catalog integration, and access review.
---

# Creating Data Lake Table

Use this skill when the user wants a new AWS data lake table, especially a managed Iceberg table with Amazon S3 Tables. For ingesting existing data, create or identify the table first, then use the ingestion skill.

Safety rules:

- Ask before creating S3 Tables buckets, namespaces, tables, Glue catalog integration, IAM policies, Lake Formation grants, KMS configuration, or Athena DDL.
- Check for existing catalogs, namespaces, and matching table names before creating anything.
- Do not grant broad IAM permissions. Ask for the querying principal and scope permissions to the required table, namespace, and catalog resources.
- For AWS MCP documentation lookups, reduce the request to a sanitized docs question. For live AWS MCP API calls, send only the minimum approved identifiers and payload needed for the requested operation. Do not include secrets, unneeded account IDs, customer data, private code, log payloads, billing details, or confidential architecture.

Workflow:

1. Confirm region, table purpose, table name, namespace, expected query engine, and whether this should be S3 Tables or a standard Iceberg table.
2. Verify AWS access only after the user approves account inspection.
3. Resolve fuzzy database or table names with the asset-finding skill before creating a new table.
4. Gather schema details: grain, columns, types, required fields, partition strategy, expected volume, and lifecycle needs.
5. Enforce lowercase table, namespace, and column naming for Glue and S3 Tables compatibility.
6. List existing table buckets and namespaces. Recommend reuse when it fits the workload.
7. Prepare the S3 Tables table metadata, including Iceberg schema and partition spec. For complex types, ensure explicit field IDs.
8. Review access requirements for `s3tables`, Glue, Athena, Lake Formation, and KMS before applying changes.
9. Create the table only after showing the final plan and getting confirmation.
10. Verify with S3 Tables get-table and a minimal Athena `DESCRIBE` or metadata check.

Prefer a small, reversible first table when requirements are uncertain. Do not create IAM roles or broad policies automatically.
