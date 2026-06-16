---
name: expo-api-data
description: Use when implementing Expo API routes, server-side secrets, data fetching, React Query, SWR, offline behavior, authentication headers, or Expo Router loaders.
---

# Expo API Routes And Data

Use this skill for network calls, API routes, caching, and data loading in Expo apps.

## API Route Fit

Use Expo Router API routes when the app needs:

- Server-side secrets that must not reach the client.
- Database or third-party API calls that require trusted credentials.
- Webhook endpoints, server validation, rate limiting, or proxy behavior.
- Lightweight backend logic deployed with the Expo app.

Avoid API routes when data is public, no secret is involved, a managed backend already owns the CRUD path, or realtime behavior needs a dedicated realtime service.

## Data Fetching

- Prefer platform `fetch` or project-standard fetching utilities before adding `axios`.
- Use React Query, SWR, or the existing state layer for caching, retries, optimistic updates, and background refresh.
- Keep environment-specific base URLs centralized.
- Handle offline and flaky mobile networks with explicit loading, retry, timeout, stale data, and empty states.
- For authenticated requests, keep token refresh and storage in one module.

## Secrets

- Never expose API keys, service credentials, database passwords, or private tokens in client code.
- Use server-only environment variables, EAS secrets, or provider secret stores.
- Use public `EXPO_PUBLIC_` variables only for values that are safe to ship in the app bundle.
- When writing examples, use placeholder names and tell the user where to store the real secret.

## Verification

- Validate request and response shapes at the server boundary when user data or webhooks are involved.
- Check web and native behavior separately when using Expo Router loaders or web-only route features.
- Avoid running live writes against user services unless the user confirms the target environment.
