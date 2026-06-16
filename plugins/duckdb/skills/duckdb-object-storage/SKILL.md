---
name: duckdb-object-storage
description: Explore and query remote data with DuckDB over S3, Cloudflare R2, GCS, Azure, HTTPS, or S3-compatible storage. Use when the user provides object-storage URLs, public datasets, remote Parquet/CSV/JSON, or asks about bucket contents.
---

# DuckDB Object Storage

Use DuckDB for remote data only when the user provided a URL or clearly asked to inspect remote storage.

## Setup

Always load `httpfs`:

```sql
INSTALL httpfs;
LOAD httpfs;
```

Choose credentials from the provider:

| Provider | URL pattern | Setup |
| --- | --- | --- |
| AWS S3 | `s3://` | `CREATE SECRET (TYPE S3, PROVIDER credential_chain);` |
| Cloudflare R2 | `r2://` or S3 URL with R2 endpoint | `CREATE SECRET (TYPE R2, PROVIDER credential_chain);` |
| GCS | `gs://` or `gcs://` | `CREATE SECRET (TYPE GCS, PROVIDER credential_chain);` |
| Azure | `az://`, `azure://`, `abfss://` | `INSTALL azure; LOAD azure; CREATE SECRET (TYPE AZURE, PROVIDER credential_chain);` |
| Public HTTPS | `https://` | Usually only `LOAD httpfs;` |

Never ask the user to paste secrets into SQL unless there is no safer provider-chain option. Do not echo secret values.

## Directory or bucket listing

For directory-like URLs, list metadata only:

```sh
duckdb :memory: -csv <<'SQL'
LOAD httpfs;
SELECT filename, (size / 1024 / 1024)::DECIMAL(10,1) AS size_mb, last_modified
FROM read_blob('s3://bucket/prefix/*')
ORDER BY filename
LIMIT 50;
SQL
```

Do not select `content` from `read_blob` unless the user explicitly asks to download file contents.

## File or glob preview

```sh
duckdb :memory: -csv <<'SQL'
LOAD httpfs;
DESCRIBE FROM 's3://bucket/path/data.parquet';
SELECT count() AS row_count FROM 's3://bucket/path/data.parquet';
FROM 's3://bucket/path/data.parquet' LIMIT 20;
SQL
```

For Parquet row counts, prefer metadata:

```sql
SELECT file_name, sum(row_group_num_rows) AS total_rows
FROM parquet_metadata('s3://bucket/path/*.parquet')
GROUP BY file_name;
```

## Cost and privacy

Warn before broad bucket scans, large globs, or remote queries that may transfer substantial data. Narrow prefixes and push predicates into Parquet scans when possible.
