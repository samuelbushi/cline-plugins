# Pinecone

Pinecone adds vector database workflows for Cline, including integrated-index MCP tools, bundled skills for common Pinecone development tasks, and a small community helper command.

## Cline Primitives

- MCP: registers the `pinecone` stdio MCP server. The server exposes Pinecone integrated-index operations such as listing, creating, describing, upserting, and querying indexes.
- Skills: bundles Pinecone workflow skills for quickstarts, querying, Assistant, full-text search, MCP usage, docs lookup, CLI usage, and n8n workflow generation.
- Command: `/pinecone-discord` returns the Pinecone Discord invite.
- Rule: adds Pinecone-specific guardrails for API keys, index mutations, document/vector writes, Assistant files, and n8n workflow changes.

## Requirements

- A Pinecone account and `PINECONE_API_KEY` for live MCP or API-backed workflows.
- Node.js and npm for the plugin-owned MCP server, which runs with `npx -y @pinecone-database/mcp@0.2.1`.
- Python with `uv` for skills that use bundled helper scripts.
- The Pinecone CLI is optional, but useful for workflows covered by the `pinecone-cli` skill.

Set `PINECONE_API_KEY` in the environment that starts Cline before using live Pinecone tools:

```bash
export PINECONE_API_KEY=pcsk_...
cline plugin install pinecone
```

The plugin-owned MCP settings entry stores `${env:PINECONE_API_KEY}`, not your API key. Cline expands that placeholder from the environment when it starts the MCP server, so restart Cline or reload MCP servers after changing the value.

## Trust Boundaries

The MCP server is started by Cline's normal MCP startup flow and receives `PINECONE_API_KEY` only through the environment placeholder above. Treat workspace files, query text, documents, metadata, Assistant uploads, and generated n8n workflows as data that may leave your machine through Pinecone or related services once you approve live operations.

Bundled helper scripts are not run during plugin installation. Review commands before running scripts that create indexes, upsert documents, sync files, upload Assistant context, or call Pinecone APIs.

## License

Bundled Pinecone skills and helper scripts are provided under the license in `LICENSE.pinecone`.
