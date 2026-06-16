---
name: firecrawl-monitoring
description: Create and manage Firecrawl monitors for recurring website change detection with email or webhook notifications. Use when the user wants alerts, tracking, or ongoing checks.
---

# Firecrawl Monitoring

Use monitoring when the user wants to be told when a page or site changes. Do not use repeated manual scrapes when a monitor better matches the request.

## Create A Monitor

Single page:

```bash
firecrawl monitor create --name "Pricing watch" \
  --schedule "hourly" \
  --goal "Alert when pricing information changes." \
  --page "https://example.com/pricing" \
  --email "alerts@example.com"
```

Multiple URLs:

```bash
firecrawl monitor create --name "Docs watch" \
  --schedule "daily" \
  --goal "Alert when docs pages are added, removed, or substantively changed." \
  --scrape-urls "https://example.com/docs,https://example.com/changelog"
```

Webhook:

```bash
firecrawl monitor create --name "Webhook watch" \
  --schedule "hourly" \
  --goal "Alert when visible page content changes." \
  --page "https://example.com/status" \
  --webhook-url "https://example.com/webhook" \
  --webhook-events monitor.page,monitor.check.completed
```

## Manage Monitors

```bash
firecrawl monitor list --limit 20
firecrawl monitor get <monitorId>
firecrawl monitor run <monitorId>
firecrawl monitor checks <monitorId>
firecrawl monitor check <monitorId> <checkId> --page-status changed
firecrawl monitor update <monitorId> --state paused
firecrawl monitor delete <monitorId>
```

## Goal Writing

- Start with `Alert when ...`.
- Include only the scope the user gave: price, role, region, top N, status, product, or topic.
- Add one `Ignore ...` sentence only for user-relevant noise.
- Do not invent thresholds, exclusions, or business rules.

## Guardrails

- Ask before creating monitors, sending email alerts, or registering webhooks.
- Confirm the schedule and recipients before create/update.
- Monitoring can consume credits over time. Mention that for broad or frequent checks.
- Do not create monitors for private or login-gated pages unless the user confirms authorization.
