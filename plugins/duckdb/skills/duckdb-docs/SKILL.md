---
name: duckdb-docs
description: Search DuckDB and DuckLake documentation with DuckDB. Use when a DuckDB SQL feature, function, extension, error, or DuckLake concept needs authoritative documentation.
---

# DuckDB Docs

Use this skill to answer DuckDB and DuckLake documentation questions through DuckDB-hosted search indexes.

## Setup

Check DuckDB and load required extensions:

```sh
command -v duckdb
duckdb :memory: -c "INSTALL httpfs; INSTALL fts;"
```

Use `duckdb-setup` if DuckDB is missing or extension installation fails.

## Index choice

- DuckDB docs and blog: `https://duckdb.org/data/docs-search.duckdb`.
- DuckLake docs: `https://ducklake.select/data/docs-search.duckdb`.

Prefer the DuckDB docs index unless the user asks about DuckLake, lakehouse catalogs, DuckLake snapshots, or DuckLake-specific SQL.

## Search pattern

Cache indexes under `$HOME/.duckdb/docs`. Refresh stale caches only when needed. Before the first cache download, tell the user this will write a DuckDB docs index under their home directory and ask for approval.

```sh
CACHE_DIR="$HOME/.duckdb/docs"
CACHE_FILE="$CACHE_DIR/duckdb-docs.duckdb"
TMP_FILE="$CACHE_FILE.tmp"
mkdir -p "$CACHE_DIR"
duckdb :memory: <<SQL
LOAD httpfs;
LOAD fts;
ATTACH 'https://duckdb.org/data/docs-search.duckdb' AS remote (READ_ONLY);
ATTACH '$TMP_FILE' AS tmp;
COPY FROM DATABASE remote TO tmp;
SQL
mv "$TMP_FILE" "$CACHE_FILE"
```

Then search:

```sh
CACHE_FILE="$HOME/.duckdb/docs/duckdb-docs.duckdb"
duckdb "$CACHE_FILE" -readonly -json <<'SQL'
LOAD fts;
SELECT page_title, section, breadcrumb, url, version, text,
       fts_main_docs_chunks.match_bm25(chunk_id, 'window functions') AS score
FROM docs_chunks
WHERE score IS NOT NULL
ORDER BY score DESC
LIMIT 5;
SQL
```

Use compact technical search terms, not full prose questions.

## Answering

Summarize the relevant docs and include the official docs path or URL from the result. Do not paste long docs chunks into the conversation.
