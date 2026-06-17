---
name: spotify-ads-configure
description: Configure Spotify Ads API credentials via OAuth 2.0 or direct token. Sets up authentication, ad account, and execution preferences.
---

# Spotify Ads API Configuration

Set up or update the plugin's local Cline settings file.

## Modes

Parse the user's argument to determine the configuration mode:

### `oauth` (default if no argument)

Full OAuth 2.0 authorization flow. This stores access and refresh tokens in the local Cline settings file, but does not install an automatic refresh hook.

Prerequisite: The user must have added `http://127.0.0.1:8080/callback` as a redirect URI in their app settings at [developer.spotify.com](https://developer.spotify.com/). Remind the user of this before starting the flow.

1. Use `.cline/spotify-ads-api.local.md` as the settings file. Read it if it exists and preserve existing values unless the user asks to replace them.

2. Prompt the user for OAuth credentials using ask the user:
   - client_id (required) - Spotify app client ID from the developer dashboard
   - client_secret (required) - Spotify app client secret

3. Do not write `client_secret` to the settings file. Keep it only in the current configuration step or in an OS credential manager if the user explicitly chooses to store it there. Do not pass the secret as a command-line argument because command arguments can appear in process lists, shell history, logs, or transcripts.

4. Attempt the automated OAuth flow by running the helper script:

```bash
PLUGIN_ROOT="<installed spotify-ads-api plugin package directory>"
python3 "${PLUGIN_ROOT}/skills/configure/scripts/oauth-flow.py" \
  --client-id "<client_id>"
```

If `python3` is not available, try `uv run`:

```bash
PLUGIN_ROOT="<installed spotify-ads-api plugin package directory>"
uv run "${PLUGIN_ROOT}/skills/configure/scripts/oauth-flow.py" \
  --client-id "<client_id>"
```

The helper prompts for the client secret without echoing it. Do not print or log the entered value.

5. If Python is not available at all, fall back to the manual flow (see below).

6. Parse the JSON output from the script:
   ```json
   {"access_token": "...", "refresh_token": "...", "expires_in": 3600}
   ```

7. Calculate `token_expires_at` as the current time + `expires_in` seconds, formatted as ISO 8601.

8. Prompt for remaining settings:
   - ad_account_id (required) - Discover the user's ad accounts using this two-step flow:
     1. Fetch businesses: `GET /businesses` -> returns `{ "businesses": [...] }` with each business having an `id` and `name`.
     2. For each business (or the one the user selects), fetch its ad accounts: `GET /businesses/{business_id}/ad_accounts` -> returns `{ "ad_accounts": [...] }` with each account having an `id`, `name`, and `status`.
     3. Present the list and let the user select. If only one ad account exists across all businesses, select it automatically.
     4. If the API calls fail or return empty, ask the user to paste their ad account ID manually.
   - auto_execute (optional, default: false) - Whether to execute API calls without confirmation

9. Write the Cline settings file (see Settings File Format below).

10. Use `SDK_HEADER="X-Spotify-Ads-Sdk: cline-plugin/1.4.0"`.

11. Verify with a test API call:
```bash
curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer <token>" \
  -H "$SDK_HEADER" \
  "https://api-partner.spotify.com/ads/v3/ad_accounts/<ad_account_id>"
```

### `manual`

Manual OAuth flow for environments where the automated script cannot run.

Prerequisite: The user must have added `http://127.0.0.1:8080/callback` as a redirect URI in their app settings at [developer.spotify.com](https://developer.spotify.com/). Remind the user of this before starting the flow.

1. Prompt for client_id and client_secret using ask the user.

2. Do not write `client_secret` to the settings file. Keep it only in the current command or in an OS credential manager if the user explicitly chooses to store it there. Do not place the secret directly in shell history.

3. Display the authorization URL for the user to open in their browser:
   ```
   https://accounts.spotify.com/authorize?client_id=<CLIENT_ID>&response_type=code&redirect_uri=http://127.0.0.1:8080/callback
   ```

4. Instruct the user to:
   - Open the URL in their browser
   - Authorize the application
   - Copy the full redirect URL from the browser address bar (it will show an error page since no server is running, but the URL contains the code)

5. Ask the user to paste the redirect URL, then extract the `code` parameter from it.

6. Exchange the code for tokens. Keep the client secret out of shell history by reading it silently:
```bash
read -rsp "Spotify client secret: " SPOTIFY_CLIENT_SECRET
printf "\n"
AUTH_HEADER=$(printf "%s:%s" "<client_id>" "$SPOTIFY_CLIENT_SECRET" | base64 | tr -d "\n")
unset SPOTIFY_CLIENT_SECRET
curl -s -K - <<EOF
request = "POST"
url = "https://accounts.spotify.com/api/token"
header = "Authorization: Basic ${AUTH_HEADER}"
header = "Content-Type: application/x-www-form-urlencoded"
data = "grant_type=authorization_code&code=<CODE>&redirect_uri=http://127.0.0.1:8080/callback"
EOF
unset AUTH_HEADER
```

7. Parse the response for `access_token`, `refresh_token`, and `expires_in`.

8. Continue from step 7 of the `oauth` flow (calculate expiry, prompt for settings, write file, verify).

### `token <access_token>`

Legacy direct token mode for users who already have an access token.

1. Accept the access token from the argument.

2. Warn the user: "Direct token mode - this token will expire in about 1 hour. For refresh tokens, re-run with `/spotify-ads configure oauth` using your client credentials."

3. Read existing settings or prompt for:
   - ad_account_id (required) - Use the same businesses -> ad accounts discovery flow as the oauth mode (`GET /businesses` then `GET /businesses/{business_id}/ad_accounts`), or ask the user to paste it.
   - auto_execute (optional, default: false)

4. Write the settings file with the token but without refresh credentials. Set `token_expires_at` to empty.

5. Verify with a test API call.

## Settings File Format

Write `.cline/spotify-ads-api.local.md` in this exact format:

```markdown
---
access_token: "<token>"
refresh_token: "<refresh_token>"
token_expires_at: "<ISO 8601 timestamp>"
client_id: "<client_id>"
ad_account_id: "<uuid>"
environment: "production"
auto_execute: false
---

# Spotify Ads API Settings

Local configuration for the spotify-ads-api plugin.
Do not commit this file to version control.
Client secret is not stored in this file.
```

Note: `client_secret` is intentionally not stored in the settings file.

For the `token` mode, leave `refresh_token`, `token_expires_at`, and `client_id` as empty strings.

## Verification Results

Report the test API call result:
- 200: Configuration saved and verified successfully.
- 401/403: Token may be invalid or expired. Settings saved but token needs updating.
- 404: Ad account ID may be incorrect. Settings saved but check the account ID.
- Other errors: Report the status code and suggest troubleshooting.

## Security Notes

- The settings file is `.cline/spotify-ads-api.local.md`; create `.cline/` if it does not exist.
- Never log or display the full access token or client_secret - show only the last 8 characters for confirmation.
- Never write client_secret to the settings file or any other plaintext file.
- Prefer helper scripts that prompt for the client secret. Do not pass client secrets as command arguments.
