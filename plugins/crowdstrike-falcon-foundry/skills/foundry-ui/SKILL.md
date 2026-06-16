---
name: foundry-ui
description: Build Falcon Foundry UI pages and console extensions with React, Vue, Shoelace, Foundry-JS, Vite, socket IDs, theming, and backend capability calls.
when_to_use: "Use when the user wants to create or modify a Foundry UI page, UI extension, Shoelace component, Foundry-JS call, Vite config, Falcon console theme behavior, or embedded console socket UI."
---

# Foundry UI

Foundry UI surfaces are either full pages or console extensions. Use the CLI to scaffold both so manifest paths, entrypoints, and capability IDs stay correct.

## Pages and extensions

- Use pages for standalone app views.
- Use extensions for embedded Falcon console surfaces.
- For extensions, specify a valid socket ID with `--sockets`; do not rely on an interactive picker.
- Do not edit generated `manifest.yml` path or entrypoint fields unless official guidance requires it.

## Build and Vite

- Check the app root before running app-level commands.
- Build UI assets before deploy.
- If deploy reports path or entrypoint issues, inspect Vite `root`, `base`, and output settings before changing manifest paths.
- Do not start a dev server unless the user asks to inspect the UI interactively.

## Design system

- Prefer Shoelace components and Falcon-compatible design tokens.
- Support light and dark Falcon console themes.
- Avoid hardcoded colors where platform tokens are available.
- Keep layouts dense, clear, and operational. Security console UI should be fast to scan.

## Data access

- UI code should call Foundry-JS, app functions, collections, workflows, or API integrations using supported platform APIs.
- Do not embed API keys or Falcon credentials in client-side code.
- Treat detections, host records, cases, and identity data as sensitive.

## Common mistakes

- Guessing socket IDs.
- Manually changing generated entrypoint paths.
- Building a UI before backend capabilities validate.
- Logging raw security data to the browser console.
