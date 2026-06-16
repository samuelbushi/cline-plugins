---
name: domino-flows
description: Build Domino Flows for multi-step ML workflows. Use when designing DAGs, creating DominoJobTask stages, wiring typed inputs and outputs, or running pyflyte workflows remotely.
---

# Domino Flows

Domino Flows orchestrate multi-step ML workflows using Flyte concepts with Domino job execution.

## Key rule

Domino Flows tasks run as Domino jobs. Do not use native Flyte `@task` decorators for task execution. Use `DominoJobTask` with `DominoJobConfig`, and keep `@workflow` for DAG composition.

## Task pattern

```python
from flytekit import workflow
from flytekitplugins.domino.task import DominoJobConfig, DominoJobTask

preprocess_task = DominoJobTask(
    name="preprocess",
    domino_job_config=DominoJobConfig(
        Command="bash -c 'PYTHONPATH=/mnt/code python /mnt/code/stages/preprocess.py'",
    ),
    inputs={"input_path": str},
    outputs={"o0": str},
    use_latest=True,
)

train_task = DominoJobTask(
    name="train",
    domino_job_config=DominoJobConfig(
        Command="bash -c 'PYTHONPATH=/mnt/code python /mnt/code/stages/train.py'",
    ),
    inputs={"preprocessed": str},
    outputs={"o0": str},
    use_latest=True,
)

@workflow
def training_pipeline(input_path: str) -> str:
    preprocessed = preprocess_task(input_path=input_path)
    return train_task(preprocessed=preprocessed)
```

## Stage script pattern

Stage scripts should read from `/workflow/inputs/<name>` and write outputs under `/workflow/outputs/o0`. Keep stage scripts deterministic and avoid mutable shared state.

## Running remotely

Commit and push first, because remote jobs run against repository state available to Domino:

```sh
git status
git add -A
git commit -m "Add training flow"
git push
PYTHONPATH=/mnt/code pyflyte run --remote my_flow.py training_pipeline --input_path /mnt/data/raw.csv
```

Ask before committing or pushing unless the user already requested that exact Git operation.
