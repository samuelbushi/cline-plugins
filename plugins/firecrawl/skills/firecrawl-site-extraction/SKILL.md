---
name: firecrawl-site-extraction
description: Map, crawl, or download whole websites or documentation sections with Firecrawl. Use when the user needs many pages, offline docs, site structure, or bulk content extraction.
---

# Firecrawl Site Extraction

Use this skill when a single page scrape is not enough.

## Map First

Map discovers URLs without extracting every page:

```bash
mkdir -p .firecrawl
firecrawl map "https://docs.example.com" --limit 100 -o .firecrawl/docs-map.json
```

Use map before broad crawls so you can choose a narrow scope. Useful options:

- `--search "keyword"` to locate a relevant subpage
- `--include-paths "/docs,/guides"`
- `--exclude-paths "/blog,/changelog,/versions"`
- `--allow-subdomains`

## Crawl

Crawl extracts many pages as JSON:

```bash
firecrawl crawl "https://docs.example.com" --include-paths /docs --limit 50 --wait -o .firecrawl/docs-crawl.json
```

Use:

- `--wait` when results are needed now
- `--progress` for long jobs
- `--max-depth <n>` to limit link traversal
- `--max-concurrency <n>` to stay inside account limits

## Download

Download saves pages as local files. Before running it, check the installed CLI help for output-directory support and confirm where files will be written:

```bash
firecrawl download --help
firecrawl download "https://docs.example.com" --include-paths /docs --limit 25
```

Use download for offline docs, local reference packs, or generated skill input.

## Guardrails

- Ask before crawling or downloading broad domains.
- Set a page limit unless the user explicitly asks for a full site and understands credit cost.
- Keep generated files under `.firecrawl/` when the CLI supports choosing the output directory. If the CLI will write somewhere else, tell the user the path and ask before continuing.
- Do not use non-interactive confirmation flags such as `-y` until the user has approved the URL scope, page limit, and output path.
- Exclude translations, archives, changelogs, search pages, and marketing pages unless they are relevant.
