# DuckDB

DuckDB adds Cline skills for local and remote data exploration with the DuckDB CLI. It helps inspect files, run bounded SQL, attach DuckDB databases, search DuckDB docs, work with object storage, and handle spatial data.

## Cline Primitives

This is a skills-only plugin. It does not register MCP servers, tools, hooks, or commands.

The bundled skills cover:

- Installing and checking the DuckDB CLI and extensions.
- Reading, profiling, querying, and converting data files.
- Managing project-scoped DuckDB session state for attached databases.
- Searching DuckDB and DuckLake documentation through DuckDB-hosted indexes.
- Querying S3, R2, GCS, Azure, HTTPS, and public object-storage datasets.
- Running spatial workflows with the DuckDB spatial extension and Overture Maps.

## Requirements

Most workflows require the `duckdb` CLI on PATH. Some file formats or remote sources require DuckDB extensions such as `httpfs`, `spatial`, `excel`, `sqlite_scanner`, or community extensions.

DuckDB can read local files and remote object storage. Ask before installing software, writing converted output files, appending persistent state, creating secrets, or running expensive remote scans. Do not use these skills to search private Cline or other assistant session logs.
