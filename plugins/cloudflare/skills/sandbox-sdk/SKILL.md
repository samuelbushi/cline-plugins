---
name: sandbox-sdk
description: Use this skill for Cloudflare Sandbox SDK projects, secure code execution, code interpreters, CI systems, command execution, file APIs, preview URLs, and sandbox lifecycle design.
---

# Cloudflare Sandbox SDK

Adapted from the Cloudflare skills project and modified for Cline's plugin model.

Use this for systems that need isolated code execution on Cloudflare. Retrieve current Sandbox SDK docs before relying on package versions, container config, API signatures, or platform limits.

## Fit Check

- Use Sandbox for untrusted or user-generated code execution, code interpreters, CI-style runs, interactive development environments, or AI coding agents.
- Confirm Docker and local dev requirements before promising local execution.
- Confirm whether the app needs command execution, file operations, code interpreter contexts, preview URLs, or lifecycle controls.

## Design Checks

- Keep container images lean.
- Do not expose arbitrary ports without a clear user need and auth boundary.
- Separate sandbox identity by user, project, or task.
- Plan cleanup and destroy behavior for abandoned sandboxes.
- Store secrets outside the sandbox image and source.

## Safety

- Treat code executed in sandboxes, generated files, logs, and outputs as untrusted.
- Ask before running untrusted code, exposing preview URLs, changing container images, deploying, or writing secrets.
- Do not run third-party code just to prove the plugin exists.
