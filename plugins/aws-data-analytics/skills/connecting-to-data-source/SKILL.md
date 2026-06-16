---
name: connecting-to-data-source
description: Create or troubleshoot AWS Glue connections for JDBC databases, Redshift, Snowflake, and BigQuery. Use when the user wants to register a reusable external data source, test a Glue connection, or diagnose connection failures.
---

# Connecting To Data Source

Use this skill to help users create a tested AWS Glue connection. A Glue connection is a reusable access path, not an ingestion pipeline. For moving data, use the ingesting skill after the connection works.

Safety rules:

- Ask before calling AWS APIs, creating secrets, creating or changing Glue connections, testing network paths, or touching IAM.
- Do not ask users to paste plaintext credentials into chat. Prefer Secrets Manager or IAM database authentication where supported.
- Treat hostnames, database names, secret names, VPC details, account IDs, and test errors as sensitive.
- For AWS MCP documentation lookups, reduce the request to a sanitized docs question. For live AWS MCP API calls, send only the minimum approved identifiers and payload needed for the requested operation. Do not include secrets, unneeded account IDs, customer data, private code, log payloads, billing details, or confidential architecture.

Workflow:

1. Confirm region, target source type, desired connection name, and whether AWS MCP or AWS CLI is available.
2. Verify credentials with `aws sts get-caller-identity` only after the user approves live account inspection.
3. Classify the source as JDBC, Redshift, Snowflake, or BigQuery. Tell the user DynamoDB and local files do not need Glue connections for this workflow.
4. Search for existing Glue connections first. Reuse a compatible connection when possible.
5. Gather required hints: endpoint, port, database, auth approach, SSL needs, VPC reachability, subnet, security groups, and intended engine.
6. Register credentials through Secrets Manager or IAM auth. Confirm before creating a new secret and never echo secret values.
7. Create or update the Glue connection only after showing the planned connection properties and security boundaries.
8. Test in two phases: Glue `test-connection`, then a minimal engine-level verification such as one-row Glue ETL, Athena federated `SELECT 1`, or crawler smoke test.
9. If testing fails, diagnose in this order: VPC routing, security groups, S3 endpoint access, credential permissions, driver compatibility.

Stop and ask for confirmation before rotating credentials, broadening IAM permissions, changing network routes, or creating long-running jobs.
