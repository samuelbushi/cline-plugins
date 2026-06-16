---
name: fiftyone-notebooks
description: Use when creating Jupyter notebooks, tutorials, recipes, getting-started guides, or end-to-end ML pipeline notebooks with FiftyOne.
---

# FiftyOne Notebooks

Use this skill to create notebooks for FiftyOne demos, tutorials, recipes, or full ML workflows.

## Rules

- Decide notebook type first: getting started, tutorial, recipe, or end-to-end pipeline.
- Use standard FiftyOne imports and aliases.
- Create a valid `.ipynb` structure before adding cells.
- Keep code cells runnable top to bottom.
- Avoid hidden state, local absolute paths, or credentials in notebooks.
- Add markdown cells that explain why each step matters.

## Standard Imports

```python
import fiftyone as fo
import fiftyone.zoo as foz
import fiftyone.brain as fob
import fiftyone.types as fot
from fiftyone import ViewField as F
```

## Notebook Structure

1. Title and purpose.
2. Setup and imports.
3. Dataset loading or import.
4. Schema and sample inspection.
5. Inference, evaluation, curation, or visualization workflow.
6. App launch or interactive exploration instructions when useful.
7. Cleanup, export, or next steps.

For tutorials, include expected outputs and troubleshooting notes. For recipes, keep the notebook short and narrowly focused.
