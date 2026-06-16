---
name: figma-code-connect
description: Create, review, and maintain Figma Code Connect mappings between published Figma components and real code components.
---

# Figma Code Connect

Use this skill when the user mentions Code Connect, `.figma.ts`, `.figma.js`, component mapping, design-to-code translation, or connecting Figma components to repository components.

## Prerequisites

- Figma MCP server is authorized and can read the target Figma file.
- The target Figma component is published to a team library.
- The user has a plan and seat that support Code Connect.
- The repository has an identifiable component implementation and build or typecheck path.

## Workflow

1. Parse the Figma URL and resolve the file key and node id.
2. Use Figma MCP Code Connect tools such as `figma__get_code_connect_suggestions`, `figma__get_context_for_code_connect`, and `figma__get_code_connect_map` to find unmapped published components and inspect component properties.
3. Read `figma.config.json` if present. Use its parser, include, exclude, and import path settings to guide file placement.
4. Search the repository for the matching code component. Compare prop names, variants, booleans, slots, text props, and instance swaps before choosing.
5. Create the smallest useful mapping file. Prefer matching existing Code Connect style in the repository.
6. Validate with the project’s normal TypeScript, lint, or Code Connect checks when available.

## Guardrails

- Do not map unpublished Figma components. Ask the user to publish first.
- Do not guess component ids, property names, or import paths. Read them from MCP output and repository files.
- Do not commit secrets or generated access tokens into Code Connect files.
- If multiple code components could match, explain the tradeoff and ask the user to pick rather than silently choosing a risky mapping.
