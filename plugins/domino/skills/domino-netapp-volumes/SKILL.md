---
name: domino-netapp-volumes
description: Work with Domino Volumes for NetApp ONTAP. Use when creating volumes, choosing NetApp Volumes versus Domino Datasets, using snapshot paths, attaching volumes to projects, or planning large shared storage workflows.
---

# Domino NetApp Volumes

Domino Volumes for NetApp ONTAP provide enterprise storage for large datasets, snapshots, and cross-project sharing.

## Use NetApp Volumes when

- Data is multi-terabyte scale.
- Fast snapshots are required.
- Existing NetApp ONTAP infrastructure should back Domino workloads.
- Snapshot labels or commit messages matter for auditability.
- Multiple projects or teams need shared persistent storage.

Use Domino Datasets when the data is smaller, Domino-managed storage is sufficient, or users need dataset-style version workflows.

## Mount paths

Git-backed projects commonly mount volumes under:

```text
/mnt/netapp-volumes/<volume-name>/
/mnt/netapp-volumes/snapshots/<volume-name>/<snapshot-number>/
/mnt/netapp-volumes/snapshot-tags/<volume-name>/<tag-name>/
```

DFS projects commonly mount volumes under:

```text
/domino/netapp-volumes/<volume-name>/
/domino/netapp-volumes/snapshots/<volume-name>/<snapshot-number>/
/domino/netapp-volumes/snapshot-tags/<volume-name>/<tag-name>/
```

Check which root exists in the running workspace before hardcoding paths.

## Snapshot path behavior

- Numbered snapshot paths can appear in a running workspace when a new snapshot is created.
- Tag snapshot paths are stable names, but a running workspace may need a restart to see new tag paths.
- A snapshot exposes one active tag path at a time. If the same snapshot is retagged, update references.

## Safety checklist

- Confirm owner/editor/reader permissions before writing.
- Do not assume readers can write to live volumes.
- Record volume names, mount paths, and snapshot identifiers in the project docs.
- Ask before deleting data, changing grants, or replacing files on a shared volume.
