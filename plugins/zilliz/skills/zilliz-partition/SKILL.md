---
name: zilliz-partition
description: Use when the user wants to create, list, load, release, or drop partitions in a Milvus collection.
---

## Cline Compatibility

Use Cline command and file tools for this workflow. Ask before installing or upgrading `zilliz-cli`, running authentication commands, changing shell profiles, writing credentials, or performing mutating or cost-affecting Zilliz operations. Never ask the user to paste API keys into chat; have them authenticate in their own terminal or environment.

## Prerequisites
1. CLI installed, logged in, and cluster context set (see zilliz-setup skill).
2. Target collection must exist (see zilliz-collection skill).
## Commands Reference
All partition commands accept an optional `--database <db-name>` flag. If omitted, the database from the current context is used.
### Create a Partition
```bash
zilliz partition create --collection <collection-name> --partition <partition-name>
# Optional: --database <database-name>
```
### List Partitions
```bash
zilliz partition list --collection <collection-name>
# Optional: --database <database-name>
```
### Drop a Partition
```bash
zilliz partition drop --collection <collection-name> --partition <partition-name-to-drop>
# Optional: --database <database-name>
```
### Check if a Partition Exists
```bash
zilliz partition has --collection <collection-name> --partition <partition-name>
# Optional: --database <database-name>
```
### Get Statistics
```bash
zilliz partition get-stats --collection <collection-name> --partition <partition-name>
# Optional: --database <database-name>
```
### Load a Partition
```bash
zilliz partition load --collection <collection-name> --names '["partition1", "partition2"]'
# Optional: --database <database-name>
```
### Release a Partition
```bash
zilliz partition release --collection <collection-name> --names '["partition1", "partition2"]'
# Optional: --database <database-name>
```
## Guidance
- Every collection has a default `_default` partition.
- Partitions allow organizing data for more targeted searches.
- A partition must be loaded before it can be searched.
- Before dropping a partition, confirm with the user -- all data in it will be deleted.
- Use partition stats to check row counts per partition.
- For filter expression syntax used in vector operations on partitions, see the zilliz-vector skill.