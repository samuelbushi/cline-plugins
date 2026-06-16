---
name: azure-data-storage-messaging
description: Use this skill for Azure Storage, Cosmos DB, SQL, Kusto, Event Hubs, Service Bus, Event Grid, cache, data movement, and messaging architecture.
---

# Azure Data, Storage, And Messaging

Use this skill for Azure data stores, storage accounts, analytics stores, and event-driven messaging.

## Workflow

1. Identify data shape, consistency needs, latency, throughput, retention, compliance, region, and recovery requirements.
2. Choose the narrowest service fit: blobs/files/queues/tables, SQL, Cosmos DB, PostgreSQL, Kusto, Event Hubs, Service Bus, Event Grid, or cache.
3. Plan identity, network access, backup, lifecycle policies, encryption, and monitoring before implementation.
4. For migrations or schema changes, create a reversible plan with validation and rollback.
5. For messaging, define producers, consumers, retry behavior, idempotency, dead-letter handling, ordering, and poison-message handling.

## Guardrails

- Ask before reading live data, changing schemas, changing access policies, running migrations, creating queues/topics, purging messages, deleting blobs, or changing retention.
- Do not expose customer data, connection strings, SAS tokens, database credentials, or queue payloads.
- Prefer read-only inspections and dry-runs before data movement or destructive maintenance.
- Make cost implications visible for retention, replication, throughput, partitioning, and hot/cool/archive storage tiers.
