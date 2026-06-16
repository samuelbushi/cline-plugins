---
name: liquid-theme-a11y
description: Implement and review WCAG-oriented accessibility patterns in Shopify Liquid themes, including product cards, carousels, cart drawers, price display, forms, filters, modals, keyboard support, focus management, and ARIA usage.
---

# Liquid Theme Accessibility

Use this skill when creating or reviewing accessible Shopify theme components.

## Core Rules

- Prefer semantic HTML before ARIA.
- Keep all interactive controls keyboard reachable.
- Provide visible `:focus-visible` states with sufficient contrast.
- Respect `prefers-reduced-motion`.
- Use one main landmark and clear navigation labels.
- Keep heading levels in order.
- Avoid hiding useful content from screen readers unless it is truly decorative or duplicated.

## Common Patterns

- Product cards: use an `article`, one primary link, useful image alt text, and clear price context.
- Modals and cart drawers: use `dialog` where possible, trap focus, restore focus to the trigger, and close with Escape.
- Carousels: provide previous and next buttons, pause autoplay, announce slide context, and avoid auto-advancing when reduced motion is preferred.
- Forms: pair labels with inputs, use `aria-invalid` only for invalid fields, and connect errors with `aria-describedby`.
- Filters: use `fieldset`, `legend`, buttons with `aria-expanded`, and preserve keyboard navigation.
- Prices: include context for sale prices, compare-at prices, unit prices, and currency.

## Review Checklist

- Can every action be completed with keyboard only?
- Is focus order predictable after open, close, add, remove, and filter actions?
- Are controls named by visible text or accurate labels?
- Are dynamic updates announced only when helpful?
- Does the theme preserve accessibility strings through locales?
- Does the implementation avoid ARIA that conflicts with native semantics?
