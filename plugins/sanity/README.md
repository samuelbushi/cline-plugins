# sanity

Adds Sanity development, content modeling, migration, Portable Text, SEO/AEO, and Content Lake workflow guidance for Cline.

## What It Does

This plugin bundles Sanity skills for:

- Sanity schemas, GROQ, TypeGen, Visual Editing, Studio structure, image handling, localization, Functions, Blueprints, and framework integrations.
- Structured content modeling decisions such as references versus embedded objects, content reuse, taxonomy, and separation of content from presentation.
- Portable Text rendering, serialization, Markdown/HTML conversion, and migration-safe block construction.
- CMS migration planning from systems such as Contentful, WordPress, Drupal, Webflow, Strapi, Payload, AEM, Markdown, and static HTML.
- SEO and AEO implementation for metadata, structured data, sitemaps, robots, hreflang, EEAT, and AI-answer readiness.
- Content experimentation design, CMS-managed variants, metrics, statistical interpretation, and common A/B testing pitfalls.

It also registers the `sanity` MCP server at `https://mcp.sanity.io` so Cline can inspect and work with Sanity Content Lake and project context when the user connects the required Sanity access.

## Commands

- `/sanity` starts a general Sanity workflow or lists relevant help areas.
- `/sanity-review` reviews schemas, GROQ, frontend integration, Visual Editing, Portable Text, TypeGen, and content-modeling choices.
- `/sanity-typegen` inspects and runs Sanity TypeGen workflows when the user confirms local file writes.
- `/sanity-deploy-schema` prepares schema deployment and requires explicit confirmation before running remote deploy commands.

## Requirements

Users need a Sanity project and dataset for live Content Lake workflows. Local project workflows may require the Sanity CLI, Node.js, project dependencies, and an authenticated Sanity token with the minimum role needed for the requested action.

## Trust Boundaries

Sanity workflows can expose private content and mutate datasets, documents, schemas, releases, and project configuration. Review project IDs, datasets, tokens, generated mutations, migration scripts, schema deploys, imports, and MCP write operations before execution. The plugin adds guardrails requiring explicit confirmation before remote Sanity writes.
