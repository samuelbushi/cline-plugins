# alloydb

AlloyDB for PostgreSQL guidance for Cline.

## What It Adds

This plugin bundles seven skills for working with AlloyDB databases and Google Cloud AlloyDB resources:

- `alloydb-postgres-admin`: plan, inspect, create, and track clusters and instances.
- `alloydb-postgres-data`: inspect schemas and run bounded SQL work safely.
- `alloydb-postgres-monitor`: investigate active queries, locks, plans, and Cloud Monitoring metrics.
- `alloydb-postgres-health`: review table statistics, invalid indexes, bloat, autovacuum, and storage signals.
- `alloydb-postgres-optimize`: reason about settings, memory, extensions, and query tuning.
- `alloydb-postgres-replication`: inspect read pools, replication slots, publication tables, lag, and high availability state.
- `alloydb-postgres-access-management`: inspect users, roles, settings, and user creation flows.

The plugin does not register an MCP server and does not install runtime database tooling. The skills guide Cline toward explicit, user-approved `gcloud`, `psql`, and Cloud Monitoring workflows when those tools are available in the user's environment.

## Install

```bash
cline plugin install alloydb
```

For local development from this repository:

```bash
cline plugin install ./plugins/alloydb --cwd .
```

## Example Usage

After installation, ask Cline:

```text
Inspect my AlloyDB schema and suggest indexes for the slow customer lookup query.
```

```text
List long-running AlloyDB queries and explain which ones look risky to cancel.
```

```text
Plan a read pool instance for my AlloyDB cluster and show me the exact gcloud command before running it.
```

## Requirements

- Google Cloud project with the AlloyDB API enabled.
- Application Default Credentials or another explicit Google Cloud authentication setup.
- IAM roles appropriate to the task, such as AlloyDB Viewer, AlloyDB Client, or AlloyDB Admin.
- Local tools for execution when needed, usually `gcloud` for control-plane work and `psql` for database work.
- Connection details such as project, region, cluster, instance, database, user, IP type, and network access.

## Security Notes

AlloyDB operations can read production data, create cloud resources, change users, and modify database state. The skills prefer read-only discovery first, require confirmation before writes or destructive actions, and avoid printing or persisting credentials.
