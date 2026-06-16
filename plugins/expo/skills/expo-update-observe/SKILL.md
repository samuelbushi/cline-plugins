---
name: expo-update-observe
description: Use when working with EAS Update, OTA rollout health, update channels, runtime versions, EAS Observe metrics, app startup performance, route metrics, or production Expo diagnostics.
---

# Expo Updates And Observability

Use this skill for EAS Update, rollout analysis, and EAS Observe.

## EAS Update

- Inspect `eas.json`, update channels, branches, runtime version policy, and app versioning before publishing or diagnosing updates.
- Ask before running `eas update` or any command that publishes an OTA update.
- Use read-only commands first for update groups, channels, branches, and recent rollout status.
- Confirm runtime version compatibility before assuming a build can receive an update.

## Rollout Health

- Compare crash rate, failed launches, unique users, platform split, payload size, and recent update history.
- Treat very fresh update metrics as incomplete until the pipeline has had time to ingest data.
- If one platform regresses and another does not, inspect platform-specific code, native modules, assets, and runtime version differences.

## EAS Observe

- Use EAS Observe for startup, time to render, time to interactive, route timing, custom events, and version comparisons.
- Confirm the installed `expo-observe` API and SDK version before editing integration code.
- Keep instrumentation low-noise and avoid logging secrets or personally identifiable data.

## Diagnostics

- Prefer read-only CLI status and JSON output before changing release channels or publishing rollback updates.
- Ask before rolling back, republishing, changing channel mappings, or deploying a mitigation.
- When in doubt, query current Expo docs or the Expo MCP for exact command flags.
