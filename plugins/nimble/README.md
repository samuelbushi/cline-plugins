# nimble

Use Nimble web data tools from Cline for live web search, extraction, crawl, map, reusable extraction agents, and business research workflows.

## What It Does

This plugin registers the Nimble remote MCP server and bundles Nimble skills for:

- Immediate web search, URL extraction, crawl, map, async task, and Nimble agent workflows.
- Building, refining, validating, and publishing reusable Nimble extraction agents.
- Company deep dives, competitor intelligence, market discovery, meeting prep, local places research, and competitor positioning.
- SEO intelligence, talent sourcing, and healthcare provider extraction, enrichment, and verification workflows.

It also adds a safety rule for web-data collection, credentials, persistent reports, and untrusted web content.

## Install

```bash
cline plugin install nimble
```

For local development from this repository:

```bash
cline plugin install ./plugins/nimble --cwd .
```

## Requirements

- A Nimble account for live Nimble MCP usage.
- MCP OAuth through Cline for the registered `nimble` server.
- Optional Nimble CLI and `NIMBLE_API_KEY` when the user chooses CLI workflows instead of MCP tools.
- Explicit user approval before large crawls, agent publishing, persistent memory writes, external report delivery, or contact/provider/candidate list exports.

## Security Notes

This plugin does not install the Nimble CLI, run searches, create agents, crawl sites, write memory, or export data during installation. Live workflows can access third-party websites, collect structured web data, process personal or business records, and write persistent reports, so the bundled guidance keeps those actions user-approved and scoped.

Some bundled skill content is adapted from Nimble Web Search Skills under MIT license. See `LICENSE.nimble`.
