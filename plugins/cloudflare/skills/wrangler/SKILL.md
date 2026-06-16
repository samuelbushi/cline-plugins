---
name: wrangler
description: Use this skill before running Wrangler commands or editing Cloudflare Workers config for deploys, local dev, types, KV, R2, D1, Vectorize, Hyperdrive, Workers AI, Containers, Queues, Workflows, Pipelines, and secrets.
---

# Wrangler CLI

Adapted from the Cloudflare skills project and modified for Cline's plugin model.

Use this before running Wrangler commands or editing `wrangler.jsonc`, `wrangler.json`, or `wrangler.toml`. Retrieve current Wrangler docs or inspect installed Wrangler help before relying on command syntax.

## First Checks

- Identify package manager and whether Wrangler is already installed.
- Confirm account, environment, and target project before mutating Cloudflare resources.
- Prefer project-local Wrangler when present.
- Use JSON config for new projects unless the existing project already uses another supported format.
- Run or suggest `wrangler types` after binding changes.

## Common Commands

- Local dev: verify command and env first, then use Wrangler dev flow.
- Deploy: ask for explicit confirmation and target environment.
- Secrets: use Wrangler secret commands; never write secret values into source or config.
- Types: generate after binding changes.
- Tail/logs: treat output as sensitive and untrusted.

## Safety

- Ask before deploy, delete, secret write, route, DNS, database, queue, bucket, KV, R2, Vectorize, or production environment changes.
- Do not install global packages without user approval.
- Do not print tokens or secrets back to chat.
