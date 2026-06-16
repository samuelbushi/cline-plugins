---
name: fiftyone-code-style
description: Use when writing Python code for FiftyOne, contributing to the FiftyOne codebase, or aligning custom integrations with FiftyOne conventions.
---

# FiftyOne Code Style

Use this skill when writing Python that belongs in or near the FiftyOne ecosystem.

## Imports

Organize imports in four groups, alphabetized within each group:

1. Standard library.
2. Third-party packages.
3. `eta` packages.
4. FiftyOne packages.

Common aliases:

```python
import fiftyone as fo
import fiftyone.core.fields as fof
import fiftyone.core.labels as fol
import fiftyone.core.media as fom
import fiftyone.core.storage as fos
import fiftyone.core.utils as fou
from fiftyone import ViewField as F
```

## Style

- Use Google-style docstrings for public APIs.
- Keep private helpers prefixed with `_`.
- Prefer FiftyOne primitives and dataset APIs over raw MongoDB access.
- Do not manipulate FiftyOne's database directly.
- Add tests for new behavior when editing production code.
- Keep logging through module-level loggers.

## Data Safety

Never delete, rewrite, or migrate user datasets as a convenience. If a change mutates dataset contents, explain exactly what will change and ask for explicit approval.
