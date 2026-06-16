---
name: frontend-design
description: Design and implement polished, domain-appropriate frontend interfaces in Cline. Use when building or revising web apps, pages, dashboards, forms, components, design systems, or visual interaction states.
---

# Frontend Design

Use this skill when the user asks to build, redesign, or polish a frontend interface.

## Orientation

Start by identifying the product type, audience, primary workflow, and existing visual system. Read nearby components, routes, styles, tokens, and screenshots before choosing a direction. The goal is not novelty for its own sake; it is an interface that fits the domain and feels intentionally designed.

When the project already has a design system, stay inside it unless the user asks for a new direction. Reuse local components, icon libraries, spacing scales, color tokens, typography, and interaction patterns before adding new ones.

## Product Fit

Match the visual and interaction density to the product:

- Operational tools, SaaS dashboards, CRMs, admin panels, and developer consoles should feel calm, scan-friendly, efficient, and repeatable. Favor clear tables, filters, navigation, compact panels, predictable controls, and restrained styling.
- Brand, product, venue, portfolio, and campaign pages can use stronger art direction, richer imagery, expressive typography, and memorable first-viewport composition when that serves the offer.
- Games, creative tools, and playful consumer surfaces can be more illustrative, animated, and tactile, but the core interaction still needs to be usable.
- Settings, forms, onboarding, checkout, account, auth, and support flows should prioritize clarity, trust, completion speed, validation, and recovery from mistakes.

## Implementation Bar

Build the actual usable screen or component first. Avoid making a marketing shell when the user asked for an app, tool, workflow, or game.

Use real controls for real jobs: icon buttons for familiar actions, toggles for binary settings, menus for option sets, sliders or inputs for numeric values, tabs for peer views, and clear command buttons for irreversible or high-intent actions. Include empty, loading, error, disabled, focused, hover, selected, and active states when they are part of the workflow.

Keep layout stable. Use responsive constraints such as grid tracks, minmax values, fixed aspect ratios, container-relative sizing, and predictable toolbar dimensions so dynamic labels, icons, counters, cards, and board cells do not shift or overlap.

Use meaningful visual assets for websites and games, and for other interfaces when assets carry product meaning. Prefer actual product, place, object, state, gameplay, or person imagery over vague atmospheric decoration. Do not add decorative orbs, bokeh blobs, or generic gradients as a substitute for useful visual content.

## Visual Quality

Choose a clear design direction and execute it consistently. Color, type, spacing, borders, shadows, and motion should support the workflow and subject matter.

Avoid one-note palettes and default-looking composition. Use contrast, accent colors, hierarchy, and whitespace deliberately. Do not rely on the same purple, blue-slate, beige, or brown-orange theme across unrelated products.

Typography should fit the context and remain readable. Use existing type choices when the app has them. If choosing new fonts or sizes, make sure labels fit their containers at mobile and desktop widths, long words wrap cleanly, and compact panels do not use hero-scale type.

Motion should clarify cause and effect. Keep animation purposeful, short, and respectful of reduced-motion preferences. Avoid motion that delays repeated workflows or hides information.

## Accessibility And Trust

Preserve semantic HTML where possible. Keep keyboard navigation, focus states, color contrast, labels, hit targets, and screen-reader names in mind while implementing. Do not hide essential information inside hover-only affordances.

For data, payments, admin, auth, deployment, destructive actions, or customer-content workflows, make state and consequences visible. Confirmation, undo, preview, and audit-friendly copy matter more than decoration.

## Verification

Before calling the work finished, inspect the result in realistic desktop and mobile viewports when the stack supports it. Use screenshots or browser previews when available. Fix overlapping text, clipped buttons, unstable controls, broken images, unreadable contrast, awkward scroll areas, and first-viewport composition issues.

Run the project's relevant formatter, typecheck, tests, or build command when available and proportionate to the change. If visual inspection is impractical, state what was verified and what remains unverified.
