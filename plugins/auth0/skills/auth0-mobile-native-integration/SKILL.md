---
name: auth0-mobile-native-integration
description: Use when adding Auth0 login, logout, token refresh, deep links, biometric credential storage, or callback configuration to native, mobile, desktop, React Native, Expo, Flutter, Ionic, MAUI, Swift, Android, WPF, or WinForms apps.
---

# Auth0 Mobile And Native Integration

Use this skill for client apps that use a system browser or platform web auth flow.

## Discover

Identify:

- Platform and framework.
- Package manager.
- Bundle ID, package name, app scheme, or platform callback format.
- Auth0 domain and client ID.
- Login, logout, and token refresh requirements.
- Secure credential storage needs.
- Existing deep link configuration.

Ask before installing packages or changing Auth0 tenant settings.

## Implementation Shape

- Use Authorization Code with PKCE through the platform SDK.
- Use the system browser or platform web auth helper.
- Configure callback and logout URLs exactly for the platform.
- Store refresh tokens and credentials in platform secure storage when the SDK supports it.
- Add login, logout, profile, and token retrieval flows.
- Add biometric gates only when the platform SDK and user requirements support them.

## Platform Hints

- React Native and Expo: configure native schemes and app links through the project config.
- Ionic with Capacitor: wire browser callback handling through Capacitor app events.
- Swift and Android: configure bundle/package callbacks and platform manifests.
- Flutter: distinguish mobile from web. Mobile uses native callbacks; web uses SPA-style redirects.
- MAUI, WPF, and WinForms: follow the desktop SDK callback pattern for that platform.

## Confirmation Gate

Before editing tenant settings, show callback URLs, logout URLs, app type, and native scheme changes.

## Verification

Run compile or platform config checks first. Ask before launching emulators, opening browsers, or running live login flows.
