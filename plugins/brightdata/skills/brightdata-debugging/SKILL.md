---
name: brightdata-debugging
description: Use when Bright Data CLI, API, proxy, browser, MCP, scraper, session, zone, budget, authentication, empty-output, or failed-extraction behavior needs debugging.
---

# Bright Data Debugging

Use this skill to diagnose Bright Data failures without leaking credentials or starting unnecessary network work.

## First Triage

Ask for or inspect:

- the exact command or API call shape, with secrets redacted
- target domain or dataset name
- Bright Data surface in use: CLI, REST, SDK, MCP, proxy, Browser API, Scraper Studio
- status code, error code, request ID, session ID, or collector ID
- whether the failure is auth, quota, empty data, timeout, blocked target, or parsing

Do not ask the user to paste raw API keys, proxy passwords, cookies, or full headers.

## Safe Local Checks

These are usually safe when the user is debugging local setup:

```bash
command -v bdata
bdata version
```

Run account, budget, zone, search, scrape, browser session, or collector calls only when the user has asked to inspect live Bright Data state.

## Failure Patterns

| Symptom | Likely Area |
| --- | --- |
| 401 or unauthenticated CLI | login, token, environment variable, wrong account |
| 403 or forbidden target | account permission, product not enabled, target restriction |
| empty results | wrong dataset, selector issue, blocked source, overly narrow query |
| timeout | browser-heavy page, long scraper generation, missing async polling |
| high bandwidth | large media, redirects, browser session left running, excessive pages |
| TLS or certificate errors | proxy CA setup, corporate MITM, invalid local cert store |

## Debugging Rules

- Keep samples small.
- Redact secrets from command output before sharing.
- Surface recoverable IDs such as collector IDs or session IDs.
- When a generated scraper fails after creating a collector, preserve the collector ID so the user can inspect or repair it.
- For empty extraction, verify whether the page actually contains the requested fields before changing code.
- Never suggest `NODE_TLS_REJECT_UNAUTHORIZED=0`, `curl -k`, `verify=False`, or equivalent certificate bypasses.
