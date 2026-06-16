---
name: exa-research
description: Use Exa MCP search and fetch tools for current web research, source discovery, competitive research, literature scans, company research, code or docs lookup, and multi-source synthesis.
---

# Exa Research

Use this skill when the user asks for current web research, source discovery, deep dives, competitive analysis, literature reviews, code or documentation lookup, company research, people discovery, or extraction from known URLs.

## Privacy Gate

Before searching or fetching a URL, decide whether the query, URL, or requested page contains private code, secrets, customer data, internal hostnames, tokenized links, unreleased business plans, or confidential text. If it does, ask the user before sending it to Exa. When possible, rewrite private details into public-safe search terms.

Do not paste API keys, tokens, cookies, full private stack traces, proprietary source files, private URLs, or signed download links into search queries or fetch requests.

## Auth and Rate Limits

If Exa returns an auth or rate-limit error, surface that directly. Ask the user to authorize Exa through Cline's MCP auth flow or provide an Exa API key using the server's supported setup path. Do not silently fall back to generic search when the user explicitly asked for Exa.

## Search Planning

Classify the request before searching:

- Simple lookup: one or two targeted searches, then fetch the best source if needed.
- Current status or news: search with exact dates or date ranges derived from today's date.
- Comparison or best-of: define evaluation criteria before searching.
- Company or market research: search by company name, category terms, customer segment, funding, competitors, and product pages.
- Literature or technical research: include official docs, papers, release notes, standards, and reputable engineering writeups.
- Exhaustive or deep research: split into independent search angles and merge results carefully.

For ambiguous depth, ask whether the user wants a quick pass or a deeper sweep.

## Source Handling

- Prefer primary sources: official docs, product pages, standards, papers, changelogs, filings, or direct company material.
- Use reputable secondary sources for interpretation, market context, or independent confirmation.
- Deduplicate by URL and entity.
- Fetch pages when snippets are insufficient or when a claim needs verification.
- Track dates for news, product changes, releases, and pricing.
- Avoid relying on SEO copies of the same content.

## Query Patterns

Start specific, then broaden:

- Exact entity plus task: `Acme product documentation API rate limits`.
- Category plus constraint: `open source vector database hybrid search benchmark 2026`.
- Source-targeted: `site:docs.example.com authentication redirect uri`.
- Recent updates: include exact date ranges when the user asks for recent or latest information.
- Alternatives: combine product names with `competitors`, `alternatives`, `versus`, `pricing`, or `case study`.

If results are weak, change the angle instead of only swapping synonyms.

## Answer Shape

For research answers, include:

- Direct answer or recommendation.
- Key evidence with source URLs or cited source names.
- Important caveats, freshness limits, and contradictions.
- A short next-step list when more verification would materially improve confidence.

For tables, define columns before searching and keep empty fields explicit rather than guessing.
