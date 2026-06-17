# spotify-ads-api

Spotify Ads API workflow skills for planning campaigns, configuring OAuth, managing campaigns and ad sets, uploading creative assets, pulling reports, monitoring delivery, exporting campaign data, cloning entities, and performing carefully reviewed bulk operations.

## What It Adds

This plugin bundles detailed Spotify Ads API v3 skills, reference docs, examples, OAuth helper scripts, and a local settings template. It does not register an MCP server and does not contact Spotify during installation.

Use `/spotify-ads <request>` as a single entry point for natural-language workflows, or ask directly for a specific Spotify Ads task such as configuring credentials, creating a campaign, checking delivery, exporting campaign data, or pulling aggregate reports.

## Cline Primitives

- Command: `/spotify-ads` submits a Spotify Ads API workflow request back into Cline with the plugin context.
- Skills: campaign strategy, API reference, OAuth configuration, campaigns, ad sets, ads, creative assets, full campaign builds, reports, dashboards, monitoring, exports, bulk updates, and cloning.
- Rules: credential masking, local settings guidance, write-confirmation requirements, private API-output handling, and conservative `auto_execute` behavior.

## Requirements

- A Spotify Developer account with an ads-enabled app.
- A Spotify Ads ad account ID and accepted Spotify Ads API terms for the app/account.
- Python 3.8+ for the automated OAuth helper scripts, or manual OAuth through curl.
- `curl` for API calls.
- Local settings stored at `.cline/spotify-ads-api.local.md`.

The OAuth helper scripts use the redirect URI `http://127.0.0.1:8080/callback`. Add that redirect URI in the Spotify Developer Dashboard before running `/spotify-ads configure`.

## Trust Boundaries

Spotify Ads API calls send campaign plans, targeting choices, budgets, creative asset metadata, report requests, and uploaded asset files to Spotify. Reports and API responses can contain private campaign and account data.

API write operations can create, pause, resume, update, archive, upload, or bulk-change advertising resources. The plugin instructs Cline to preview writes and ask for explicit confirmation by default. Keep `auto_execute` disabled unless the user deliberately wants confirmed workflows to run without additional prompts.

Access tokens and refresh tokens are stored in `.cline/spotify-ads-api.local.md`. Client secrets should not be written to project files; provide them only for the OAuth flow or store them in an OS credential manager when available.

## License Notes

Bundled Spotify Ads API skill material is Apache-2.0 licensed. See `LICENSE.spotify-ads-api`.
