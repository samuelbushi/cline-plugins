---
name: expo-sdk-upgrade
description: Use when upgrading Expo SDK versions, fixing dependency conflicts, migrating removed Expo packages, adopting new architecture changes, or cleaning caches after an Expo upgrade.
---

# Expo SDK Upgrade

Use this skill for Expo SDK upgrades and dependency repair.

## Upgrade Plan

- Inspect the current Expo SDK, React Native version, package manager, app config, native directories, and EAS config.
- Read the target SDK release notes and migration guide before making version-specific changes.
- Use `npx expo install expo@latest` or the requested target SDK, then `npx expo install --fix`.
- Run `npx expo-doctor` after dependency updates.

## Native Project Check

- If there is no `ios/` or `android/` directory, treat the project as using Continuous Native Generation unless other evidence says otherwise.
- If native directories exist, check whether the app is bare or prebuild-managed before recommending `npx expo prebuild --clean`.
- Ask before deleting native folders, clearing native build artifacts, or regenerating native projects.

## Migration Work

- Look for deprecated imports, moved Expo packages, removed APIs, React or React Native changes, and config plugin updates.
- Apply codemods only after confirming they match the project and target SDK.
- Keep package changes minimal and compatible with Expo install guidance.
- Update tests, type checks, and route behavior after navigation or native-module migrations.

## Cache And Dependency Repair

- Start with package-manager install and `npx expo-doctor`.
- Clear Metro, Expo, native, or package-manager caches only when symptoms justify it.
- Tell the user before running expensive rebuilds or deleting lockfiles.

## Verification

- Verify startup, navigation, data fetching, push/deep links, camera/media, auth, and any native modules touched by the upgrade.
- Test iOS, Android, and web separately when the project supports them.
