# shopify-liquid

Adds Shopify Liquid theme guidance and diagnostics to Cline.

## What It Does

Registers `liquid_theme_diagnostics`, which runs `shopify theme check` in the active workspace or a theme subdirectory and returns bounded output. This gives Cline a practical diagnostics primitive for Liquid themes without pretending Cline has a persistent language-server plugin surface.

It also bundles three skills:

- `shopify-liquid-themes`: Liquid syntax, theme architecture, sections, blocks, snippets, schema, filters, objects, tags, and detailed reference tables.
- `liquid-theme-standards`: CSS, JavaScript, and HTML standards for Shopify themes, including bundled CSS and JavaScript pattern references.
- `liquid-theme-a11y`: Accessibility patterns for Shopify Liquid theme components, including bundled component, focus, and keyboard references.

## Install

```bash
cline plugin install shopify-liquid
```

For local development from this repository:

```bash
cline plugin install /absolute/path/to/cline-plugins/plugins/shopify-liquid --cwd /path/to/theme
```

## Requirements

- A Shopify Liquid theme workspace.
- Shopify CLI available on `PATH` for `liquid_theme_diagnostics`.
- No account or network access is required for the bundled skills.

## Security Notes

The diagnostics tool runs the local `shopify theme check` command in the selected workspace directory. Review the workspace before running local tooling from untrusted projects.

## Third-Party Notice

The bundled Shopify Liquid skill material is licensed under MIT. See `LICENSE.shopify-liquid-skills` and `NOTICE.shopify-liquid-skills`.
