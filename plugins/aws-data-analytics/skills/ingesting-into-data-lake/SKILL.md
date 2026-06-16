---
name: ingesting-into-data-lake
description: Plan and run data ingestion into an AWS data lake from S3 files, local files, JDBC sources, Redshift, Snowflake, BigQuery, DynamoDB, or existing Glue catalog tables.
---

# Ingesting Into Data Lake

Use this skill for one-time loads, recurring pipelines, migrations, and data movement into S3 Tables or standard Iceberg tables. Use the connection skill first when the source connection is not already tested.

Safety rules:

- Ask before reading source data, uploading local files, creating or running Glue jobs, submitting Athena CTAS or INSERT statements, creating schedules, changing IAM, or writing to target tables.
- Bound exploratory reads with filters, limits, or partitions. Avoid full scans unless the user explicitly approves cost and scope.
- Treat source schemas, sample rows, query outputs, S3 paths, credentials, and job logs as sensitive.
- Do not paste secrets into scripts, job arguments, or chat. Use Secrets Manager or IAM auth.
- For AWS MCP documentation lookups, reduce the request to a sanitized docs question. For live AWS MCP API calls, send only the minimum approved identifiers and payload needed for the requested operation. Do not include secrets, unneeded account IDs, customer data, private code, log payloads, billing details, or confidential architecture.

Workflow:

1. Identify source type, target table format, target location, data volume, load frequency, freshness needs, and acceptable downtime.
2. Verify the target table or create it with the table creation skill.
3. Verify source access. For JDBC, Redshift, Snowflake, or BigQuery, require a tested Glue connection or create one through the connection skill.
4. Choose the ingestion path: Athena CTAS or INSERT for simple bounded loads, Glue ETL for larger or recurring jobs, DynamoDB export or direct Glue read for DynamoDB, and multipart S3 upload for local files.
5. Define schema mapping, type conversions, partitioning, incremental watermark, dedupe strategy, and failure handling.
6. Show the planned commands, estimated scan or write scope, target path, and rollback approach before execution.
7. Run a small validation sample first. Compare row counts, null checks, schema, and representative values.
8. Run the full ingestion only after confirmation.
9. Record what was loaded, where it landed, validation results, costs or scan size if available, and follow-up monitoring.

Do not debug network or credential failures inside this skill. Hand those back to the connection skill.
