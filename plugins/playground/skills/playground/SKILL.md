---
name: playground
description: Creates interactive HTML playgrounds - self-contained single-file explorers that let users configure something visually through controls, see a live preview, and copy out a follow-up prompt. Use when the user explicitly asks to make a playground, explorer, or prompt/spec builder for a topic.
---

# Playground Builder

A playground is a self-contained HTML file with interactive controls on one side, a live preview on the other, and a prompt output at the bottom with a copy button. The user adjusts controls, explores visually, then copies the generated prompt into a follow-up Cline request.

## When to use this skill

When the user asks for an interactive playground, explorer, or visual prompt/spec builder - especially when the input space is large, visual, or structural and hard to express as plain text. Do not use this skill for ordinary requests to build an app, website, or tool unless the user specifically wants a prompt-generating playground.

## Safety and privacy

- Generated playgrounds are portable HTML files. Do not embed secrets, credentials, private customer data, proprietary code, or sensitive document text unless the user explicitly asks for that content to be included.
- Prefer small representative snippets or summarized structure over full documents, full diffs, or full codebase maps unless the user asks for full coverage.
- Escape all workspace-derived or user-provided text before inserting it into HTML. Use `textContent`, `createTextNode`, or a small `escapeHtml()` helper. Avoid assigning untrusted text to `innerHTML` or raw HTML attributes.
- Before opening the file in a browser, tell the user where it was written and what kinds of content it embeds.

## How to use this skill

1. Identify the playground type from the user's request
2. Load the matching template from `templates/`:
   - `templates/design-playground.md` - Visual design decisions (components, layouts, spacing, color, typography)
   - `templates/data-explorer.md` - Data and query building (SQL, APIs, pipelines, regex)
   - `templates/concept-map.md` - Learning and exploration (concept maps, knowledge gaps, scope mapping)
   - `templates/document-critique.md` - Document review (suggestions with approve/reject/comment workflow)
   - `templates/diff-review.md` - Code review (git diffs, commits, PRs with line-by-line commenting)
   - `templates/code-map.md` - Codebase architecture (component relationships, data flow, layer diagrams)
3. Follow the template to build the playground. If the topic doesn't fit any template cleanly, use the one closest and adapt.
4. Open in browser. After writing the HTML file, tell the user where the HTML file was written and, if they want, open it with the OS-appropriate browser command.

## Core requirements (every playground)

- Single HTML file. Inline all CSS and JS. No external dependencies.
- Responsive layout. Controls, preview, and prompt output must remain usable on both laptop and narrow mobile widths.
- Safe text rendering. Escape or use text nodes for any content derived from files, diffs, schemas, samples, or user input.
- Live preview. Updates instantly on every control change. No "Apply" button.
- Prompt output. Natural language, not a value dump. Only mentions non-default choices. Includes enough context to act on without seeing the playground. Updates live.
- Copy button. Clipboard copy with brief "Copied!" feedback.
- Sensible defaults + presets. Looks good on first load. Include 3-5 named presets that snap all controls to a cohesive combination.
- Dark theme. System font for UI, monospace for code/values. Minimal chrome.
- No overlapping text. Give fixed-format areas stable dimensions and make long labels wrap or truncate cleanly.

## State management pattern

Keep a single state object. Every control writes to it, every render reads from it.

```javascript
const state = { /* all configurable values */ };

function updateAll() {
  renderPreview(); // update the visual
  updatePrompt();  // rebuild the prompt text
}
// Every control calls updateAll() on change
```

## Prompt output pattern

```javascript
function updatePrompt() {
  const parts = [];

  // Only mention non-default values
  if (state.borderRadius !== DEFAULTS.borderRadius) {
    parts.push(`border-radius of ${state.borderRadius}px`);
  }

  // Use qualitative language alongside numbers
  if (state.shadowBlur > 16) parts.push('a pronounced shadow');
  else if (state.shadowBlur > 0) parts.push('a subtle shadow');

  prompt.textContent = `Update the card to use ${parts.join(', ')}.`;
}
```

## Common mistakes to avoid

- Prompt output is just a value dump -> write it as a natural instruction
- Too many controls at once -> group by concern, hide advanced in a collapsible section
- Preview doesn't update instantly -> every control change must trigger immediate re-render
- No defaults or presets -> starts empty or broken on load
- External dependencies -> if CDN is down, playground is dead
- Prompt lacks context -> include enough that it's actionable without the playground
