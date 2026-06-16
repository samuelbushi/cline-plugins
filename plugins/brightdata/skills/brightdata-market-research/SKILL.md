---
name: brightdata-market-research
description: Use for Bright Data assisted competitive intelligence, brand listening, price comparison, SEO audits, launch monitoring, and cited market research from live web data.
---

# Bright Data Market Research

Use this skill when the user asks for research that depends on current public web data.

## Research Modes

| Mode | Use For |
| --- | --- |
| Competitive intelligence | competitor positioning, pricing, hiring, content, reviews |
| Brand listening | mentions, sentiment, complaints, advocacy, launch response |
| Price comparison | retailer prices, stock, variants, regional availability |
| SEO audit | metadata, structured data, indexation proxy, SERP checks |
| General research brief | multi-source current evidence with citations |

Do not answer time-sensitive market questions from model memory alone. Either collect live data through approved tools or say what data is missing.

## Workflow

1. Clarify the decision the research should support.
2. Define target entities, platforms, region, and time window.
3. Run a small discovery pass before deeper extraction.
4. Prefer high-signal sources over exhaustive crawling.
5. Normalize records into a consistent schema.
6. Separate facts, quotes, and analysis.
7. Deliver concise recommendations with evidence and caveats.

## Evidence Rules

Every material claim should trace back to a source URL, query, dataset, or user-provided file. If a platform has no results, include that as a caveat rather than filling the gap.

For sentiment, classify from collected text only. Do not infer sentiment from brand reputation or prior knowledge.

For price comparison, normalize currency, shipping, condition, stock status, seller, and timestamp before ranking offers.

For SEO, distinguish HTML-observable findings from data that requires Google Search Console, PageSpeed Insights, analytics, or paid SEO tools.
