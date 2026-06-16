---
name: domino-environments
description: Create, customize, and troubleshoot Domino Compute Environments. Use when installing packages, writing Dockerfile instructions, choosing Domino Standard Environments, configuring IDEs, or fixing environment build failures.
---

# Domino Environments

Domino Compute Environments are Docker-based images used by workspaces, jobs, apps, and model endpoints.

## When to use this skill

- The user needs Python, R, system packages, CUDA, IDEs, or CLI tools available in Domino.
- A Domino environment build is failing.
- The user asks whether to install dependencies at image build time, project startup, or runtime.
- The user needs reproducible package versions for jobs or model endpoints.

## Recommended dependency placement

- Put stable operating system packages and core libraries in Dockerfile instructions.
- Put project-specific Python packages in `requirements.txt` only when rebuild latency is a problem.
- Use pre-run scripts sparingly for small, execution-specific setup.
- Avoid runtime installs inside notebooks or scripts for production jobs.

## Dockerfile instruction rules

Domino environment instructions usually extend a selected base image. Do not include a `FROM` line unless the Domino environment UI explicitly asks for a full Dockerfile.

Prefer:

```dockerfile
RUN apt-get update && apt-get install -y \
    graphviz \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir \
    pandas==2.2.2 \
    scikit-learn==1.5.1
```

## Troubleshooting checklist

1. Read the build log from the first failing command, not the final summary.
2. Check package version compatibility with the base Python, R, CUDA, or OS version.
3. Combine apt install and apt cleanup in one layer.
4. Pin critical packages for reproducibility.
5. Move secrets out of Dockerfile instructions and into Domino environment variables or secret stores.
6. Rebuild and test with the same environment revision that jobs or endpoints will use.
