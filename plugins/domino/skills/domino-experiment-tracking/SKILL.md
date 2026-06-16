---
name: domino-experiment-tracking
description: Track ML experiments in Domino with MLflow. Use when setting up experiment names, enabling autologging, logging metrics or artifacts, comparing runs, or preparing model registry entries.
---

# Domino Experiment Tracking

Domino Experiment Manager is MLflow-based. Use it for traditional ML training runs, metrics, parameters, artifacts, run comparison, and model registration.

## Core pattern

Experiment names must be unique across the Domino deployment. Include a username, project name, or other stable namespace in generated names.

```python
import os
import mlflow

username = os.environ.get("DOMINO_STARTING_USERNAME", "unknown")
project = os.environ.get("DOMINO_PROJECT_NAME", "project")
experiment_name = f"{project}-{username}-training"

mlflow.set_experiment(experiment_name)
mlflow.autolog()

with mlflow.start_run(run_name="baseline"):
    model.fit(X_train, y_train)
    mlflow.log_metric("validation_accuracy", 0.95)
```

## Framework support

- Scikit-learn: `mlflow.sklearn.autolog()`.
- TensorFlow/Keras: `mlflow.tensorflow.autolog()`.
- PyTorch: `mlflow.pytorch.autolog()`.
- XGBoost: `mlflow.xgboost.autolog()`.
- LightGBM: `mlflow.lightgbm.autolog()`.
- Generic: `mlflow.autolog()`.

## Review checklist

- Metrics are logged with stable names and units.
- Parameters capture important dataset, feature, and training choices.
- Artifacts include plots, evaluation reports, and model files needed for review.
- Run names are meaningful enough for comparison later.
- Registration only happens after the user confirms the intended model and stage.
