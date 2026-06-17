---
name: zilliz-database
description: Use when the user wants to create, list, describe, or drop databases in Milvus.
---

## Cline Compatibility

Use Cline command and file tools for this workflow. Ask before installing or upgrading `zilliz-cli`, running authentication commands, changing shell profiles, writing credentials, or performing mutating or cost-affecting Zilliz operations. Never ask the user to paste API keys into chat; have them authenticate in their own terminal or environment.

## Prerequisites
1. CLI installed, logged in, and cluster context set (see zilliz-setup skill).
## Commands Reference
### Create a Database
```bash
zilliz database create --name <database-name>
# Or use raw JSON: --body '{"properties": {}}'
```
*Create a new database. (Dedicated only)*
### List Databases
```bash
zilliz database list
```
### Describe a Database
```bash
zilliz database describe --name <database-name>
```
*Get details of a database. (Dedicated only)*
### Drop a Database
```bash
zilliz database drop --name <database-name-to-drop>
```
*Drop a database. (Dedicated only)*
## Guidance
- Database create, describe, and drop operations are only available on Dedicated clusters. `database list` works on all cluster types.
- Every cluster has a "default" database.
- Before dropping a database, confirm with the user -- all collections in it will be deleted.
- After creating a database, suggest switching context: `zilliz context set --database <db-name>`.
- To work with collections in a non-default database, use `--database` flag on collection commands or switch context.