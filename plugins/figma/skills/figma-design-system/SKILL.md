---
name: figma-design-system
description: Build, audit, and update Figma design-system foundations such as variables, styles, components, variants, documentation pages, and code alignment.
---

# Figma Design System

Use this skill when the user asks for variables, tokens, component libraries, variants, theming, Figma library cleanup, or alignment between a codebase and a Figma design system.

## Recommended Order

1. Discover the codebase design tokens, components, naming conventions, themes, and accessibility constraints.
2. Inspect the existing Figma file, pages, variables, styles, components, and published library references.
3. Propose the v1 scope. Name the token groups and components that will be created or changed.
4. Build foundations first: primitive variables, semantic variables, color modes, text styles, effects, spacing, radius, and documentation structure.
5. Build components after foundations. Work from atoms to larger components and validate each component before moving on.
6. Add Code Connect mappings when component APIs and Figma properties are stable.
7. Run a final audit for naming, accessibility, hardcoded values, duplicate components, missing docs, and unbound styles.

## Guardrails

- Ask before changing shared variables, deleting components, publishing library changes, or making large cross-file edits.
- Bind component visual properties to variables when possible. Avoid hardcoded fills, strokes, spacing, and radius in reusable components.
- Keep variant matrices practical. Split component families when combinations become hard to review or maintain.
- Preserve existing library conventions unless the user explicitly asks for a redesign.
- Treat design-system changes as product-facing work. Prefer checkpoints and validation over a single large mutation.
