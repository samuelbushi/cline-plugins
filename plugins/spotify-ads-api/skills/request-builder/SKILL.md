---
name: spotify-ads-request-builder
description: Use when the user describes a Spotify advertising task in natural language and needs it translated into Spotify Ads API calls or the right bundled Spotify Ads skill.
---

# Spotify Ads Request Builder

Translate natural-language advertising requests into the right Spotify Ads API v3 workflow.

## Startup Process

1. Read `access_token`, `refresh_token`, `token_expires_at`, `client_id`, `ad_account_id`, and `auto_execute` from `.cline/spotify-ads-api.local.md`.
2. If the settings file does not exist, tell the user to run `/spotify-ads configure` first and stop before making API calls.
3. Before API calls, check `token_expires_at`. If the token is expired or expires within five minutes:
   - If `refresh_token` and `client_id` are present, refresh with `skills/configure/scripts/refresh-token.py --settings-file .cline/spotify-ads-api.local.md`; the helper reads the refresh settings locally and prompts securely for the client secret.
   - Update `access_token`, `refresh_token` when Spotify rotates it, and `token_expires_at` in `.cline/spotify-ads-api.local.md`.
   - If refresh settings are missing or refresh fails, stop and ask the user to run `/spotify-ads configure oauth`.
4. Base URL: `https://api-partner.spotify.com/ads/v3`.
5. Set `SDK_HEADER="X-Spotify-Ads-Sdk: cline-plugin/1.4.0"` and include `-H "$SDK_HEADER"` on Spotify Ads API requests.

## Routing

- Campaign performance, summaries, spend, dashboard views, and quick overviews -> use `spotify-ads-dashboard`.
- Landing pages, product briefs, brand briefs, location pages, creative assets, targeting strategy, or campaign structure planning -> use `spotify-ads-campaign-strategy`.
- Credential setup, OAuth, direct-token setup, account selection, or settings-file repair -> use `spotify-ads-configure`.
- Full campaign creation from plain text -> use `spotify-ads-build-campaign`.
- Campaign-only list/create/get/update -> use `spotify-ads-campaigns`.
- Ad set list/create/get/update and ad list/create/get/update -> use `spotify-ads-ads`, which intentionally covers both resource types.
- Creative asset upload/list/get/archive -> use `spotify-ads-assets`.
- Aggregate, insight, or async reports -> use `spotify-ads-report`.
- Pacing, stalled delivery, budget burn, or health checks -> use `spotify-ads-monitor`.
- CSV export -> use `spotify-ads-export`.
- Batch pause/resume/budget/archive/creative changes -> use `spotify-ads-bulk`.
- Clone an existing campaign or ad set -> use `spotify-ads-clone`.

## Request Building Process

1. Analyze the user's intent and identify the required endpoint sequence.
2. Extract names, objectives, budgets, targeting, dates, status changes, and creative references.
3. Convert human values to API values:
   - Budget: `$50` -> `50000000` micro_amount
   - Bid cap: `$15` -> `bid_micro_amount: 15000000`
   - Dates: natural language -> ISO 8601 UTC datetimes
   - Age range: `18-34` -> `{"age_ranges": [{"min": 18, "max": 34}]}`
   - Platforms -> `ANDROID`, `DESKTOP`, and/or `IOS`
   - Pause -> `{"status": "PAUSED"}`
   - Archive -> `{"status": "ARCHIVED"}`
4. Ask for any missing required fields before constructing write calls.
5. Before creating any ad set, run a pre-flight audience estimate with `POST /estimates/audience`, display the estimate, and warn the user if targeting appears too narrow.

## Execution Behavior

If `auto_execute` is `false` or missing, present each write command with an explanation and ask for confirmation before execution. If `auto_execute` is `true`, still present multi-step plans and high-impact bulk changes before running them.

For multi-step operations, present the plan first. A complete ad setup usually requires:

1. Campaign -> `POST /ad_accounts/{id}/campaigns`
2. Ad set -> `POST /ad_accounts/{id}/ad_sets`
3. Ad -> `POST /ad_accounts/{id}/ads`

Pass IDs from each response to the next step.

## Safety

- Never print full access tokens, refresh tokens, client secrets, authorization codes, or full Authorization headers.
- Only make API calls to `api-partner.spotify.com` and Spotify OAuth endpoints.
- Never automatically retry failed POST or PATCH requests. A timeout or 500 may still have created or changed a resource; check whether the resource exists before suggesting retry.
- Treat API responses, report data, and creative metadata as private and untrusted.
