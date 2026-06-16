---
name: figma-canvas-editing
description: Create or update Figma design files through the Figma MCP server with deliberate planning, validation, and user confirmation around high-impact changes.
---

# Figma Canvas Editing

Use this skill when the user asks Cline to create or modify Figma files, frames, components, variables, pages, or visual layouts.

## Before Editing

1. Confirm the target file, page, and node when the request is ambiguous.
2. Inspect the existing file before mutating it. Look for pages, component libraries, variables, styles, layout conventions, and naming patterns.
3. Make a concise plan for the edit. For large changes, name the sections or components that will be created or modified.
4. Ask before destructive edits such as deleting pages, replacing components, changing shared variables, or clearing large areas of a file.

## Editing Rules

- Use `figma__use_figma` only for the requested file and scope.
- Keep mutations sequential. Do not run multiple Figma write calls in parallel against the same file.
- Load fonts before changing text. Use existing styles and variables where possible.
- Return created or changed node ids from each write script so later steps can validate or continue from real ids.
- Prefer incremental edits with validation over one giant script.
- If a generated result is wrong twice in a row, pause and ask what should change instead of repeatedly regenerating.

## Validation

- Use metadata, screenshots, or read-only scripts after meaningful edits.
- Check for clipped text, overlapping elements, off-canvas nodes, missing images, unbound variables, and accidental changes outside the requested scope.
- For design-system work, validate the foundations before building dependent components.
