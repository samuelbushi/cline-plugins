---
name: expo-eas-build-release
description: Use when configuring EAS Build, EAS Submit, App Store Connect, Google Play, TestFlight, production builds, web deployment, app versioning, or release credentials.
---

# Expo EAS Build And Release

Use this skill for Expo build, submit, hosting, and app store release workflows.

## Requirements Check

- Confirm the app slug, bundle identifier, Android package, Expo account, and target environment.
- Confirm whether the user wants a simulator build, internal distribution, TestFlight, Play internal track, production store build, or web deployment.
- Check `eas.json`, app config, package scripts, and current CLI login state before changing release files.
- Prefer `npx eas-cli@latest` or the project-standard EAS command path.

## Build Profiles

- Keep development, preview, and production profiles distinct.
- Use production profiles for store artifacts and development profiles for dev clients.
- Set versioning and auto-increment behavior deliberately.
- Avoid changing credentials or build numbers without explaining the effect.

## Store Submission

- Ask for explicit confirmation before running `eas submit`, `eas build --submit`, metadata pushes, or commands that affect app store state.
- For iOS, confirm Apple Developer access, App Store Connect metadata, bundle ID, provisioning, and TestFlight or release intent.
- For Android, confirm the Play app exists, service account access is scoped correctly, and target track or rollout status is intentional.

## Web And API Deployment

- Use EAS Hosting when the app includes Expo web output or API routes that the user wants deployed through Expo.
- Ask before deploying production hosting changes.
- Keep secrets out of client bundles and configure server-side secrets through EAS or provider secret stores.

## Release Safety

- Prefer dry runs, config inspection, and read-only status commands before long builds.
- Surface cost, queue time, signing, and account permission implications before starting cloud jobs.
