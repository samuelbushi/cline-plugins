---
name: a11y-debugging
description: Debug web accessibility with Chrome DevTools MCP, including semantic structure, labels, focus order, keyboard navigation, contrast, tap targets, and Lighthouse accessibility audits.
---

# Accessibility Debugging

Use this skill when the user asks about accessibility, screen readers, ARIA, keyboard navigation, focus management, labels, contrast, tap targets, or Lighthouse accessibility results.

## Baseline Workflow

1. Navigate to the page or user-specified state.
2. Run a Lighthouse accessibility audit when a broad baseline is useful.
3. Capture an accessibility snapshot with `take_snapshot`.
4. Check console issues with `list_console_messages` filtered to browser issues when available.
5. Use `evaluate_script` only for targeted checks that the snapshot cannot answer.
6. Report concrete findings with affected elements and code-level fixes.

## What To Check

- One clear page title and one meaningful `h1`.
- Heading levels do not skip unexpectedly.
- Buttons, links, inputs, images, and custom controls have accessible names.
- Form controls are associated with labels or accessible descriptions.
- Focus order follows the visual and logical flow.
- Modals move focus inside and return focus when closed.
- Keyboard users can reach and operate every interactive control.
- Images have useful `alt` text or are correctly decorative.
- Color contrast is sufficient for normal and large text.
- Tap targets are large enough and not crowded.

## Useful Tools

- `take_snapshot` for accessible names, roles, headings, landmarks, and focused elements.
- `press_key` with `Tab`, `Shift+Tab`, `Enter`, `Space`, and `Escape` to test keyboard behavior.
- `take_screenshot` when visual order, visible focus rings, or contrast needs inspection.
- `lighthouse_audit` for broad automated findings.
- `evaluate_script` for targeted DOM checks such as missing labels or tap target dimensions.

## Reporting

Lead with the issues that block users. For each issue, include:

- what fails
- who it affects
- where it appears
- how to fix it
- how to verify the fix

Do not treat Lighthouse score alone as success. Verify important interactions with keyboard and snapshot checks.
