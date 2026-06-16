---
name: alloydb-omni-container
description: Use this skill for AlloyDB Omni container workflows with Docker or Podman, including planning, starting, inspecting, stopping, removing, logging, and connecting.
---

# AlloyDB Omni Container

Use this skill for local or standalone AlloyDB Omni container deployments.

## Fit

The container model is useful for local development, offline testing, and lightweight standalone environments. It is not the default recommendation for production workloads that need high availability, managed backups, or Kubernetes operations.

## Start Workflow

1. Ask which runtime to use: `docker` or `podman`.
2. Ask for the image tag. If the user has no preference, suggest checking supported AlloyDB Omni versions before choosing `latest`.
3. Ask for a container name, data directory, host port, and initial password handling.
4. Check whether the data directory and container name already exist before creating anything.
5. Show the exact run command before executing it.
6. After start, verify status and explain how to connect.

## Inspect And Connect

- Use `docker ps -a` or `podman ps -a` to find containers.
- Use logs to diagnose startup failures.
- For interactive `psql`, prefer giving the user the command to run in a separate terminal unless the current tool environment can safely handle interactive sessions.

## Guardrails

- Do not create, stop, remove, or overwrite containers or data directories without explicit confirmation.
- Do not print database passwords in chat or shell history.
- Treat persistent processes and port mappings as user-visible changes.
