---
name: brightdata-rag-pipelines
description: Use when the user wants to build a retrieval, web-grounded QA, search engine, or RAG pipeline using Bright Data Discover, scraped pages, structured datasets, embeddings, and a vector store.
---

# Bright Data RAG Pipelines

Use Bright Data as the acquisition layer for web-grounded retrieval when the user needs current sources rather than a static corpus.

## Pipeline Shape

1. Discover candidate sources with `bdata discover`, SERP, or curated URL lists.
2. Fetch page content or structured datasets with the narrowest Bright Data API that fits.
3. Normalize each document with source URL, title, fetched timestamp, language, and license/usage notes when known.
4. Chunk by semantic sections, not arbitrary byte counts.
5. Embed and store chunks with source metadata.
6. Retrieve with filters for recency, domain, region, or document type.
7. Answer with citations and freshness caveats.

## Fresh Retrieval vs Ingestion

Use fresh retrieval when:

- the question is time-sensitive
- the corpus changes frequently
- the user only needs a one-off report

Use ingestion when:

- the same corpus will be queried repeatedly
- the user needs latency control
- documents need enrichment, deduplication, or access controls

## Safety And Quality

- Do not ingest private, paid, or personal data unless the user owns or is authorized to process it.
- Store only the fields needed for retrieval.
- Keep raw captures out of git.
- Deduplicate by canonical URL and content hash.
- Preserve source metadata through every transformation.
- Treat retrieval output as evidence, not truth; conflicting sources should be surfaced.
