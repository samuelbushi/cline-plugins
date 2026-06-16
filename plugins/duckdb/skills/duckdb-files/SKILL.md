---
name: duckdb-files
description: Inspect, profile, or convert data files with DuckDB. Use when the user asks what is in a file, wants a preview/profile, or wants to convert CSV, Parquet, JSON, Excel, GeoJSON, SQLite, or similar data formats.
---

# DuckDB Files

Use this skill for file inspection and format conversion. It is for data files, not source code.

## File inspection

1. Resolve the file path inside the workspace.
2. Check DuckDB is installed.
3. Load only required extensions.
4. Run a bounded inspection.

```sh
duckdb :memory: -csv <<'SQL'
DESCRIBE FROM 'data.csv';
SELECT count() AS row_count FROM 'data.csv';
FROM 'data.csv' LIMIT 20;
SQL
```

Common extension needs:

| Format | Setup |
| --- | --- |
| Parquet, CSV, JSON | Usually built in |
| Excel | `INSTALL excel; LOAD excel;` |
| SQLite | `INSTALL sqlite_scanner; LOAD sqlite_scanner;` |
| GeoJSON, Shapefile, GeoPackage | `INSTALL spatial; LOAD spatial;` |
| HTTPS, S3, GCS, Azure | `INSTALL httpfs; LOAD httpfs;` |

## Conversion

Ask before writing output files. Choose the output format from the extension:

```sh
duckdb :memory: <<'SQL'
COPY (FROM 'input.csv') TO 'output.parquet';
SQL
```

Useful output clauses:

- CSV: `WITH (FORMAT csv, HEADER)`.
- JSON array: `WITH (FORMAT json, ARRAY true)`.
- JSON lines: `WITH (FORMAT json, ARRAY false)`.
- Excel: `WITH (FORMAT xlsx)` after loading `excel`.
- GeoJSON: `WITH (FORMAT GDAL, DRIVER 'GeoJSON')` after loading `spatial`.
- Partitioned Parquet: `WITH (FORMAT parquet, PARTITION_BY (year))`.

## Report

On success, report the input path, output path if any, detected columns, row count, and notable patterns. For large files, prefer summaries and samples instead of full output.
