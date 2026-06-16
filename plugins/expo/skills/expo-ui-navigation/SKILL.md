---
name: expo-ui-navigation
description: Use when implementing Expo Router navigation, React Native UI, platform styling, animations, native tabs, SwiftUI or Jetpack Compose Expo UI components, DOM components, or media-heavy app screens.
---

# Expo UI And Navigation

Use this skill when building user-facing Expo screens.

## Navigation

- Prefer Expo Router route files over manually wiring React Navigation for new Expo apps.
- Use stack, tabs, modal, and route-group layouts that match the product workflow.
- Keep navigation state predictable: avoid hidden duplicate routes, ambiguous dynamic segments, and mixed routing patterns.
- When migrating navigation, update imports, remove obsolete route files, and test deep links or initial routes.

## UI Implementation

- Use React Native primitives, Expo packages, and project-established component systems before adding new UI dependencies.
- Prefer `useWindowDimensions()` for responsive layout decisions.
- Keep platform differences explicit with `Platform.select`, platform file suffixes, or narrowly scoped conditional rendering.
- Use `expo-image`, `expo-blur`, `expo-linear-gradient`, Reanimated, Gesture Handler, and native controls when they fit the project and are already compatible.
- Read installed package types before using newer Expo UI SwiftUI or Jetpack Compose components, because these APIs can change quickly.

## Styling

- Respect existing styling: StyleSheet, NativeWind, Tamagui, Restyle, CSS modules for web, or the local design system.
- If adding NativeWind or Tailwind, check the project Expo SDK and NativeWind version first, then use the current setup docs.
- Avoid introducing global styling rewrites unless the user explicitly wants a styling migration.

## DOM Components

- Use DOM components for web-only React components, charts, editors, embeds, or complex DOM/CSS that would be expensive to rewrite natively.
- Avoid DOM components for simple UI, high-performance gestures, native sensors, or deeply native interactions.
- Keep props serializable and put each DOM component in its own file with the `"use dom"` directive.

## Quality Gate

- Check iOS, Android, and web impact separately.
- Preserve accessibility labels, touch target size, keyboard behavior, safe areas, and reduced-motion expectations.
- If a native rebuild is required, say so before changing dependencies.
