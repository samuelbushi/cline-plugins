---
name: aws-dev-storage-data
description: Design and review AWS storage and data stores, including S3, DynamoDB, RDS, Aurora, lifecycle policies, access control, and data durability.
---

# AWS Dev Storage Data

Use this skill for S3 bucket design, storage optimization, DynamoDB schema design, RDS or Aurora selection, lifecycle policies, backups, access control, and data durability planning.

Safety rules:

- Ask before reading bucket listings, database metadata, table samples, backups, parameter groups, or access policies.
- Treat schemas, object keys, bucket names, table names, database identifiers, snapshots, and access policies as sensitive.
- Do not delete data, change lifecycle policies, alter database parameters, create indexes, or update access policies without explicit confirmation.
- Verify service limits, defaults, and region support with `awsknowledge` when needed.

Workflow:

1. Classify the data: object, key-value, relational, time-series, analytical, archive, or derived.
2. Pick the simplest service that satisfies access patterns, latency, durability, consistency, and operations.
3. For S3, review block public access, encryption, ownership controls, versioning, lifecycle, replication, and access points.
4. For DynamoDB, design access patterns first, then partition key, sort key, GSIs, capacity mode, TTL, and streams.
5. For RDS and Aurora, choose engine, Multi-AZ, backup retention, proxy, parameter groups, maintenance, and failover posture.
6. Include cost drivers: storage class, requests, provisioned capacity, snapshots, cross-region replication, and data transfer.
7. Define backup, restore, and migration validation steps.

Never optimize storage cost by weakening durability, backup, or access controls without making the tradeoff explicit.
