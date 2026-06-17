---
access_token: ""
refresh_token: ""
token_expires_at: ""
client_id: ""
ad_account_id: ""
environment: "production"
auto_execute: false
---

# Spotify Ads API Settings

Local configuration for the spotify-ads-api plugin. Store this file at
`.cline/spotify-ads-api.local.md`.
Do not commit this file to version control.
Do not store the client secret in this file.

## Fields

- access_token: Your Spotify Ads API OAuth2 bearer token.
- refresh_token: OAuth2 refresh token used by the configure/request skills when refreshing after the user provides the client secret.
- token_expires_at: ISO 8601 timestamp when the access token expires.
- client_id: Your Spotify app client ID from the developer dashboard.
- ad_account_id: The UUID of the ad account to use by default.
- environment: `production`.
- auto_execute: Set to `true` to execute API calls without confirmation, `false` to preview first.

## Client Secret

Keep the client secret in an OS credential manager or provide it only during the OAuth flow. Never write it to this file.
