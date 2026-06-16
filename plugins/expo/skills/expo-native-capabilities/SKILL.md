---
name: expo-native-capabilities
description: Use when adding Expo native modules, development clients, App Clips, brownfield React Native integration, config plugins, iOS or Android native code, or custom native capabilities.
---

# Expo Native Capabilities

Use this skill when an Expo app needs native behavior beyond Expo Go.

## Decision Path

- First decide whether Expo Go is enough.
- If native code is required, decide between a development client, prebuild, a local Expo module, a standalone Expo module, or brownfield integration.
- Explain the native rebuild requirement before adding dependencies or config plugins.
- Check whether the project already has `ios/` or `android/` directories before recommending prebuild changes.

## Development Clients

- Use development clients when testing custom native code, local Expo modules, unsupported third-party native modules, App Clips, widgets, or native config changes.
- Prefer EAS Build for team-distributed clients and local run commands for fast native iteration on a configured machine.
- Keep development and production EAS profiles separate.

## Expo Modules

- Prefer `create-expo-module` for new native modules instead of hand-building the scaffold.
- Choose local modules for one app and standalone modules for reusable packages.
- Confirm the needed platforms and native features before scaffolding.
- Keep TypeScript bindings, config plugins, and native implementation changes in sync.

## App Clips And Extensions

- Treat bundle identifiers, associated domains, AASA files, entitlements, and provisioning profiles as deployment-critical configuration.
- Ask before changing app identifiers, Apple team IDs, associated domains, or signing settings.
- Verify the AASA file and domain reachability before diagnosing App Clip invocation.

## Brownfield

- Use isolated integration when native teams need packaged AAR or XCFramework artifacts.
- Use integrated integration when one team owns the native app and React Native code in the same build.
- Confirm ownership, release cadence, minimum OS versions, and build tooling before recommending an approach.
