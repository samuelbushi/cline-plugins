---
name: brightdata-search-and-extract
description: Use for authorized Bright Data search, page extraction, structured dataset pulls, Discover queries, and deciding whether a task should use SERP, Web Unlocker, Web Scraper API, Discover, CLI, or SDK.
---

# Bright Data Search And Extraction

Use Bright Data when the user needs current web data and has a legitimate reason to collect it. Confirm authorization and scope when unclear.

## Pick The Right Product

| Task | Bright Data Surface |
| --- | --- |
| Search engine results | SERP API or `bdata search` |
| Intent-ranked discovery with optional page content | Discover API or `bdata discover` |
| Extract one page as markdown or HTML | Web Unlocker or `bdata scrape` |
| Known platform data such as retail, social, business, or app store entities | Web Scraper API or `bdata pipelines` |
| Pages requiring clicks, scrolling, login in an owned account, or screenshots | Browser API |

Prefer structured dataset APIs over custom scraping when a first-party Bright Data dataset exists for the target. They are usually easier to validate and less brittle.

## Scope Before Collection

Clarify:

- Target domain, URL list, query, or platform.
- Fields needed and output format.
- Time window or geography.
- Expected volume and cost tolerance.
- Whether personal data, private accounts, paid content, or regulated data could be involved.

Start with a small sample and inspect the output before scaling up.

## CLI Patterns

Use JSON for machine-readable output:

```bash
bdata search "site:example.com pricing" --json --pretty
bdata discover "enterprise database benchmarks" --num-results 10 --json
bdata scrape "https://example.com/article" --format markdown --json
```

For datasets, use a named pipeline or dataset only after checking it matches the target platform and fields.

## Validation

Before summarizing results:

- Confirm output parsed successfully.
- Report empty result sets as empty, not as failure.
- Preserve source URLs for claims.
- Separate collected evidence from inference.
- Mention gaps, sampling limits, or blocked targets.

Do not claim full coverage from a small sample.
