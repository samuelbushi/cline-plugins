---
name: domino-data-connectivity
description: Connect Domino workloads to external data sources. Use when configuring S3 Mountpoint, AWS IRSA, Azure Entra ID, External Data Volumes, or cloud credential propagation for Domino jobs and workspaces.
---

# Domino Data Connectivity

Domino workloads can access data through project datasets, data sources, External Data Volumes, S3 Mountpoint, and cloud credential propagation.

## Choose the access pattern

| Pattern | Use when |
| --- | --- |
| Domino Datasets | Data is project-scoped and managed by Domino. |
| Data Sources | The workload needs external database connections. |
| External Data Volumes | External storage should mount into jobs and workspaces. |
| S3 Mountpoint | Large S3 datasets should appear as local files. |
| AWS IRSA | AWS access must use short-lived role credentials. |
| Azure Entra ID | Azure access should use user identity and RBAC. |

## S3 Mountpoint

Use S3 Mountpoint when file-oriented code needs direct S3 access without copying large objects into Domino-managed storage.

```python
import pandas as pd

df = pd.read_parquet("/mnt/s3-data/datasets/sales.parquet")
```

## AWS IRSA

With IRSA configured, AWS SDKs use projected credentials without hardcoded keys.

```python
import boto3

s3 = boto3.client("s3")
objects = s3.list_objects_v2(Bucket="my-bucket")
```

## Review checklist

- No long-lived cloud keys are committed or written into notebooks.
- IAM, RBAC, and volume permissions are scoped to the intended project and data.
- Mount paths are documented in the project README or runbook.
- Jobs and model endpoints use the same access path that was tested in workspaces.
