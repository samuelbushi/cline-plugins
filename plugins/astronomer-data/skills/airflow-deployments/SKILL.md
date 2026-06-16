---
name: airflow-deployments
description: Use when deploying Airflow projects or DAGs with Astro, Docker Compose, Helm, Kubernetes, or CI/CD. Requires explicit confirmation before production deploys or destructive changes.
---

# Airflow Deployments

Use this skill for deploying Airflow DAGs, Astro projects, Docker images, Helm releases, or CI/CD changes.

## First Checks

- Identify whether the project targets Astro, open-source Airflow, Docker Compose, Helm, or another platform.
- Inspect deployment files such as `Dockerfile`, `requirements.txt`, `packages.txt`, `dags/`, `plugins/`, Helm values, and CI workflows.
- Determine whether changes are DAG-only, image-level, dependency-level, or infrastructure-level.
- Confirm the target workspace, deployment, cluster, namespace, or environment.

## Astro

Common commands:

```bash
astro dev parse
astro deploy --dags
astro deploy
```

Use DAG-only deploys only when DAG files changed. Use full deploys when dependencies, Docker image, packages, plugins, or environment-level code changed.

## Open-Source Airflow

- For Docker Compose, verify image tags, mounted DAG paths, env files, executor choice, database, and broker.
- For Helm or Kubernetes, inspect values, secrets references, image tags, workers, scheduler, triggerer, webserver, and migration jobs.
- Prefer immutable image tags over mutable `latest`.

## Confirmation Gate

Ask for explicit confirmation before:

- Running `astro deploy` or any production deployment command.
- Applying Helm or Kubernetes changes.
- Rebuilding or pushing production images.
- Deleting deployments, namespaces, databases, volumes, or secrets.
- Changing production environment variables or Airflow connections.

Before asking, summarize exact command, target environment, expected impact, and rollback path.
