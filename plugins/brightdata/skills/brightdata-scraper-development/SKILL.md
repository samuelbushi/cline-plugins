---
name: brightdata-scraper-development
description: Use when the user wants Cline to design, implement, or review Bright Data scraper code using Web Unlocker, Web Scraper API, Browser API, Scraper Studio, Python SDK, JavaScript SDK, or proxy integrations.
---

# Bright Data Scraper Development

Use this skill to build production code around Bright Data. The goal is maintainable, authorized data collection, not ad hoc extraction at any cost.

## Design Flow

1. Identify target URLs, data fields, freshness needs, and volume.
2. Check whether a Bright Data dataset or pipeline already covers the platform.
3. Use Web Unlocker for simple rendered page fetches.
4. Use Browser API only when interaction, screenshots, or browser state are required.
5. Use Scraper Studio when the user wants a reusable generated collector and accepts the generation/polling workflow.
6. Use raw proxies only when the application already owns request logic and Bright Data managed APIs are not a fit.

## Implementation Guardrails

- Keep credentials in environment variables or secret managers.
- Add timeouts, retries with backoff, and bounded concurrency.
- Write outputs to explicit files or databases, not arbitrary workspace locations.
- Log request IDs, target domains, and counts, but never tokens, cookies, proxy passwords, or raw sensitive content.
- Do not disable certificate validation. Install the Bright Data proxy CA only when proxy TLS interception is part of the approved setup.
- Prefer idempotent job triggers and clear resume behavior for long-running jobs.

## SDK Shape

For Python, favor a small client wrapper with:

- environment-based auth
- typed request/response models when practical
- pagination and polling helpers
- a sample-size limit for local tests

For JavaScript or TypeScript, favor:

- Node 20 or newer
- ESM-compatible imports
- explicit timeout and abort handling
- structured errors that include the operation and target, not secrets

## Review Checklist

When reviewing scraper code, look for:

- authorization and target scope in comments or README
- bounded concurrency
- retry behavior that does not hammer a target
- output schema validation
- test mode or sample limits
- no committed credentials
- no TLS-disable flags
