---
name: storing-and-querying-vectors
description: Create, store, and query embeddings with Amazon S3 Vectors, including bucket and index planning, metadata filtering, Bedrock embeddings, and query validation.
---

# Storing And Querying Vectors

Use this skill for Amazon S3 Vectors workflows: vector buckets, vector indexes, embedding storage, similarity search, metadata filters, and migration planning.

Safety rules:

- Ask before creating vector buckets or indexes, invoking embedding models, uploading vectors, querying private embeddings, changing KMS settings, or deleting vector resources.
- Treat embeddings, metadata, source documents, query text, bucket names, and result matches as sensitive.
- Do not assume an embedding model. Confirm model, dimensions, distance metric, and whether the same model is used for writes and queries.
- For AWS MCP documentation lookups, reduce the request to a sanitized docs question. For live AWS MCP API calls, send only the minimum approved identifiers and payload needed for the requested operation. Do not include secrets, unneeded account IDs, customer data, private code, log payloads, billing details, or confidential architecture.

Workflow:

1. Decide whether S3 Vectors is the right fit. For high sustained QPS, hybrid search, aggregations, or faceted search, recommend OpenSearch or a tiered design.
2. Confirm region, vector bucket, index name, embedding model, dimension, distance metric, metadata keys, encryption, expected QPS, and retention needs.
3. List existing vector buckets and indexes before creating anything.
4. Explain immutable choices before index creation: dimension, distance metric, data type, metadata configuration, and encryption.
5. Generate embeddings only after the user confirms model and input scope. Avoid sending private text to embedding services without approval.
6. Store vectors in bounded batches, with stable keys, metadata size checks, and retry with backoff for throttling.
7. Query with explicit `top-k`, optional metadata filters, and clear return-metadata behavior.
8. Validate returned distances and metadata, then explain limitations and follow-up tuning options.

Do not delete and recreate vector indexes to fix dimension or metric mismatches without explicit approval. That destroys stored vectors.
