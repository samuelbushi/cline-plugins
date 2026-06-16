---
name: shopify-liquid-themes
description: Generate or edit Shopify Liquid theme code, including sections, blocks, snippets, schema JSON, LiquidDoc comments, translation keys, filters, objects, and tags. Use when working in .liquid files or Shopify theme structure.
---

# Shopify Liquid Themes

Use this skill when creating, editing, or reviewing Shopify theme code.

## Theme Structure

- `sections/`: full-width customizable modules with `{% schema %}`.
- `blocks/`: nestable editor components with `{% schema %}`.
- `snippets/`: reusable fragments rendered with `{% render %}`.
- `layout/`: page wrappers; keep `{{ content_for_header }}` and `{{ content_for_layout }}` intact.
- `templates/`: JSON templates that select sections for page types.
- `config/`: global theme settings.
- `locales/`: translation files.
- `assets/`: shared CSS, JavaScript, and static files.

## Liquid Rules

- Use `{{ value }}` for output and `{% tag %}` for logic.
- Use whitespace trimming deliberately with `{{- value -}}` and `{%- tag -%}`.
- Liquid has no parentheses in conditions and no ternary operator. Use nested `if` blocks instead.
- `for` loops are capped at 50 iterations unless pagination is used.
- `contains` works reliably for strings; avoid assuming object-array containment.
- Use `{% render 'snippet', arg: value %}` instead of deprecated `include`.
- Snippets do not inherit arbitrary outer variables. Pass needed values explicitly.
- `{% stylesheet %}` and `{% javascript %}` do not process Liquid.

## Sections And Blocks

Every section or block schema must be valid JSON inside `{% schema %}`. Use translation keys for merchant-facing names where the theme already follows that pattern.

Common setting choices:

- `checkbox` for booleans.
- `text`, `textarea`, or `inline_richtext` for copy.
- `range` for bounded numbers with `min`, `max`, `step`, and `default`.
- `select` or `radio` for fixed choices.
- `image_picker`, `video`, `product`, `collection`, `page`, `blog`, `article`, `url`, `link_list`, and `font_picker` for Shopify editor resources.

## Output Guidance

- Preserve existing theme naming, translation, and schema conventions.
- Prefer semantic HTML and Liquid objects already available in the template.
- Keep schema defaults valid and editor-friendly.
- Avoid hardcoded merchant copy when the theme uses locales.
- Run `liquid_theme_diagnostics` after meaningful Liquid or schema changes when Shopify CLI is available.
