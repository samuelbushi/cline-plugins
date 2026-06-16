---
name: fiftyone-dataset-workflows
description: Use for importing, exporting, curating, deduplicating, splitting, inspecting, and visualizing FiftyOne datasets across images, videos, point clouds, multimodal groups, common label formats, and Hugging Face Hub datasets.
---

# FiftyOne Dataset Workflows

Use this skill for dataset import, export, curation, duplicate detection, embeddings visualization, quality checks, and train/validation/test splits.

## Safety Rules

- Never delete samples, tags, fields, brain runs, or datasets without explicit user approval.
- Inspect schema before referencing fields. Do not hardcode label field names.
- Ask before installing dataset-specific packages.
- Ask before exporting, overwriting directories, uploading to Hugging Face, or publishing data.
- Keep the FiftyOne App open when the user needs interactive review; do not close it automatically unless asked.

## Import Workflow

1. Inspect the source path or URL.
2. Detect media types, label formats, and grouping patterns.
3. Identify required packages and ask before installing them.
4. Before importing or downloading, present the source, proposed dataset name, whether the dataset will be persistent, rough size or file count when known, storage/copy behavior, and overwrite or name-conflict risk.
5. Ask for approval.
6. Import with FiftyOne's built-in dataset types when possible.
7. Summarize sample count, media type, label fields, and any skipped files.

For local directories, start with:

```bash
find /path/to/data -maxdepth 3 -type f | head -100
ls -la /path/to/data
```

## Curation Workflow

1. List and choose the dataset.
2. Set context with the MCP tool if available.
3. Inspect summary and flattened field schema.
4. Run read-only quality checks first: missing media, empty labels, class distribution, field coverage, corrupted files, and split balance.
5. For duplicates or embeddings, launch the App if required by the operator and discover operators dynamically before execution.
6. Present proposed mutations and ask before applying them.

## Export Workflow

Before exporting, show:

- dataset name and sample count
- media type
- available label fields
- target format
- absolute export path
- overwrite risk

Match export format to label type. COCO and YOLO are usually detection-oriented; CVAT and CSV can support broader structures. Use absolute paths for output directories.

## MCP Usage

When FiftyOne MCP tools are available, prefer them for dataset context, schema, operator discovery, and operator execution. Always discover operators dynamically with list/get-schema style tools before running an operator.
