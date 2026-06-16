---
name: fiftyone-model-workflows
description: Use for running model inference, applying zoo models, computing embeddings, visualizing similarity, evaluating predictions, confusion analysis, mAP, precision, recall, false-positive/false-negative review, and remote model zoo integrations.
---

# FiftyOne Model Workflows

Use this skill for model inference, embeddings, visualization, model evaluation, and remote model zoo integrations.

## Rules

- Verify the dataset exists before model work.
- Inspect schema and confirm prediction and ground-truth field names.
- Ask before downloading large model weights, installing ML packages, running expensive inference, or writing predictions to a dataset.
- Use FiftyOne primitives before custom code.
- Treat schema-conformant model outputs as necessary but not sufficient; inspect example predictions for correctness.

## Inference Workflow

1. List datasets and set the target dataset context.
2. Inspect sample count, media type, and existing fields.
3. Ask which model or task to run when it is not obvious.
4. Confirm the prediction field name.
5. Launch the App or delegated service only when required.
6. Run inference.
7. Summarize fields written, sample count processed, failures, and next review steps.

## Evaluation Workflow

1. Confirm prediction field and ground-truth field.
2. Match evaluation method to label type.
3. Confirm evaluation key and whether mAP or confusion analysis is needed.
4. Run evaluation.
5. Report metrics and identify examples worth reviewing in the App.

## Embeddings And Duplicates

- Compute embeddings before visualization, uniqueness, or duplicate search.
- Discover available brain operators and schemas dynamically.
- Ask before tagging, deleting, or creating curated subsets from duplicate/outlier findings.

## Remote Model Zoo

For custom remote model zoo sources:

- Confirm the user wants `dataset.apply_model(model)` style integration.
- Validate `manifest.json`, package imports, label return types, and worker importability.
- Avoid defining pickle-bound objects in files loaded through dynamic import mechanisms.
- Test with default worker behavior when possible.
