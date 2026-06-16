---
name: liquid-theme-standards
description: Apply CSS, JavaScript, and HTML coding standards for Shopify Liquid themes. Use when writing theme CSS, JavaScript, HTML, or component markup in .liquid files or theme assets.
---

# Liquid Theme Standards

Use progressive enhancement: semantic HTML first, CSS second, JavaScript third.

## CSS

- Use theme design tokens and CSS custom properties instead of hardcoded colors, spacing, and typography.
- Use logical properties such as `margin-inline`, `padding-block`, and `inset-inline-start` for RTL-friendly layouts.
- Prefer single-class selectors and keep specificity low.
- Avoid `!important` unless there is a documented theme integration reason.
- Use BEM-style names when the theme already does: `.product-card`, `.product-card__title`, `.product-card--featured`.
- Use `{% style %}` or inline custom properties for Liquid-driven values. Do not put Liquid inside `{% stylesheet %}`.

## JavaScript

- Prefer native browser APIs and custom elements over third-party dependencies.
- Keep behavior resilient when JavaScript fails.
- Scope DOM queries to the component root.
- Clean up event listeners, observers, and timers when components disconnect.
- Respect reduced-motion preferences for animations and scrolling.

## HTML

- Start from semantic elements: `button`, `a`, `form`, `details`, `summary`, `dialog`, `nav`, `main`, `section`, and `article`.
- Keep image width, height, lazy-loading, and alt text intentional.
- Use translation keys for merchant-facing labels and accessibility strings when the theme uses locales.
- Preserve theme editor compatibility by keeping schema IDs stable unless the user asked for a breaking migration.

## Review Checklist

- Does the code match existing theme conventions?
- Are settings names, defaults, and translation keys consistent?
- Is CSS scoped and responsive?
- Does JavaScript work with multiple section instances?
- Can the component degrade gracefully without JavaScript?
