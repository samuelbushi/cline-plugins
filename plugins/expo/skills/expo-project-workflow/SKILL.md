---
name: expo-project-workflow
description: Use when creating, running, or restructuring an Expo app, especially when choosing Expo Go, development clients, prebuild, package scripts, or Expo Router project layout.
---

# Expo Project Workflow

Use this skill for Expo project setup, local iteration, and app structure decisions.

## Default Approach

- Inspect `package.json`, `app.json` or `app.config.*`, `eas.json`, and the `app/`, `src/`, `ios/`, and `android/` directories before recommending commands.
- Prefer the project package manager and existing scripts.
- Start with Expo Go when the app does not require custom native code.
- Use a development client only when the app needs local Expo modules, third-party native modules not included in Expo Go, Apple targets, Android widgets, config plugins that change native projects, or custom native configuration.
- Avoid generating `ios/` and `android/` unless the workflow requires prebuild or the project already has native directories.

## Project Setup

- Use `npx create-expo-app@latest` for new apps unless the user has a specific template.
- Prefer Expo Router for file-based navigation in new apps.
- Keep route files in `app/`; use route groups for tabs, auth areas, modal stacks, and split layouts.
- When moving route files, remove stale files so duplicate routes do not remain.
- Use `npx expo install` for Expo-managed dependencies so compatible versions are selected.
- Run `npx expo-doctor` after dependency changes, SDK upgrades, or native-module changes.

## Local Running

- Use `npx expo start` as the first run command for managed apps.
- Use `npx expo start --clear` only when cache issues are plausible.
- Use `npx expo run:ios` or `npx expo run:android` when a native project or development client is required.
- For physical device testing, confirm the expected network and tunnel mode before changing project settings.

## Safety

- Ask before deleting native directories, clearing credentials, replacing app identifiers, or running long cloud jobs.
- Do not add secrets to app config, client JavaScript, checked-in `.env` files, or screenshots.
- When docs or CLI behavior may have changed, query the Expo MCP or current Expo docs before giving exact version-specific steps.
