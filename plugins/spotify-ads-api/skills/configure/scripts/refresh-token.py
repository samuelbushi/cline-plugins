#!/usr/bin/env python3
# /// script
# requires-python = ">=3.8"
# ///
"""Spotify Ads API token refresh.

Exchanges a refresh token for a new access token.

Usage:
    python3 refresh-token.py --settings-file .cline/spotify-ads-api.local.md
    python3 refresh-token.py --client-id ID
    uv run refresh-token.py --settings-file .cline/spotify-ads-api.local.md

Output (stdout):
    {"access_token": "...", "expires_in": 3600, "refresh_token": "..."}
    Note: refresh_token is only included if Spotify rotates it.

Diagnostics go to stderr. Exit codes:
    0  Success
    1  Invalid refresh token (401/400 from Spotify)
    2  Network or unexpected error
"""

import argparse
import base64
import getpass
import json
from pathlib import Path
import sys
import urllib.parse
import urllib.request

TOKEN_URL = "https://accounts.spotify.com/api/token"


def read_settings(path):
    values = {}
    lines = Path(path).read_text().splitlines()
    if not lines or lines[0].strip() != "---":
        return values
    for line in lines[1:]:
        if line.strip() == "---":
            break
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        value = value.strip().strip('"').strip("'")
        values[key.strip()] = value
    return values


def refresh(client_id, client_secret, refresh_token):
    credentials = base64.b64encode(
        f"{client_id}:{client_secret}".encode()
    ).decode()

    data = urllib.parse.urlencode({
        "grant_type": "refresh_token",
        "refresh_token": refresh_token,
    }).encode()

    req = urllib.request.Request(
        TOKEN_URL,
        data=data,
        headers={
            "Authorization": f"Basic {credentials}",
            "Content-Type": "application/x-www-form-urlencoded",
        },
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode()), None
    except urllib.error.HTTPError as e:
        body = e.read().decode() if e.fp else ""
        if e.code in (400, 401):
            print(f"Invalid refresh token (HTTP {e.code}): {body}", file=sys.stderr)
            return None, 1
        print(f"Token refresh HTTP {e.code}: {body}", file=sys.stderr)
        return None, 2
    except Exception as e:
        print(f"Token refresh error: {e}", file=sys.stderr)
        return None, 2


def main():
    parser = argparse.ArgumentParser(
        description="Refresh a Spotify OAuth 2.0 access token"
    )
    parser.add_argument("--client-id", help="Spotify app client ID")
    parser.add_argument("--refresh-token", help="Refresh token from initial OAuth flow")
    parser.add_argument(
        "--settings-file",
        help="Read client_id and refresh_token from .cline/spotify-ads-api.local.md",
    )
    args = parser.parse_args()
    if args.settings_file:
        try:
            settings = read_settings(args.settings_file)
        except Exception as e:
            print(f"Could not read settings file: {e}", file=sys.stderr)
            sys.exit(2)
        args.client_id = args.client_id or settings.get("client_id", "")
        args.refresh_token = args.refresh_token or settings.get("refresh_token", "")
    args.client_secret = getpass.getpass("Spotify client secret: ")
    if not args.client_secret:
        print("Client secret is required.", file=sys.stderr)
        sys.exit(2)
    if not args.client_id:
        print("Client ID is required.", file=sys.stderr)
        sys.exit(2)
    if not args.refresh_token:
        print("Refresh token is required.", file=sys.stderr)
        sys.exit(2)

    tokens, error_code = refresh(args.client_id, args.client_secret, args.refresh_token)

    if error_code is not None:
        sys.exit(error_code)

    if not tokens or "access_token" not in tokens:
        print("No access token in response.", file=sys.stderr)
        sys.exit(2)

    output = {
        "access_token": tokens["access_token"],
        "expires_in": tokens.get("expires_in", 3600),
    }
    if "refresh_token" in tokens:
        output["refresh_token"] = tokens["refresh_token"]
    print(json.dumps(output))
    sys.exit(0)


if __name__ == "__main__":
    main()
