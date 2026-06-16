---
name: aws-messaging-and-streaming
description: Choose, implement, and troubleshoot AWS messaging and streaming patterns with SQS, SNS, EventBridge, Amazon MQ, Kinesis Data Streams, Data Firehose, Managed Service for Apache Flink, and MSK.
---

# AWS Messaging And Streaming

Use this skill for asynchronous messaging, event routing, and streaming data pipelines on AWS.

## Operating Rules

- Ask before creating topics, queues, streams, brokers, rules, pipes, consumers, or IAM permissions.
- Use `aws-mcp` for current quotas, retention limits, throughput modes, and service-specific behavior.
- Before querying `aws-mcp`, reduce the request to a sanitized docs or API question. Do not include secrets, account IDs, customer data, private code, log payloads, billing details, or confidential architecture.
- Treat event payloads as sensitive. Do not print secrets or customer data from messages.
- Separate design guidance from live inspection.

## Workflow

1. Classify the pattern: queue, pub/sub, event bus, stream, broker, delivery pipeline, or stream processing.
2. Choose the service based on ordering, replay, fan-out, throughput, latency, retention, schema, and operational needs.
3. For SQS and SNS, plan DLQs, redrive, visibility timeout, batch size, and idempotent consumers.
4. For EventBridge, plan event shape, schema, rules, targets, archives, replay, and failure handling.
5. For Kinesis, Firehose, Flink, or MSK, plan partitioning, retention, consumer model, scaling, and monitoring.

## Safety Checks

- Validate resource policies and cross-account targets.
- Call out message retention and replay implications.
- Avoid logging full payloads when they may contain sensitive data.
