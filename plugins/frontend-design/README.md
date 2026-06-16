# Frontend Design

Frontend Design adds a Cline skill for building polished, domain-appropriate web interfaces. It helps Cline choose a clear visual direction, respect existing design systems, and verify that layouts work across practical desktop and mobile sizes.

The skill is useful for web apps, dashboards, tools, landing pages, forms, component systems, and visual interaction states. It does not install dependencies, call external services, or run generated applications on its own.

## What It Does

This plugin bundles one skill:

- `frontend-design`: Guides frontend implementation with product context, interaction ergonomics, visual hierarchy, responsive layout constraints, accessibility states, meaningful asset choices, and practical visual QA.

## Install

```bash
cline plugin install frontend-design
```

For local development from this repository:

```bash
cline plugin install ./plugins/frontend-design --cwd .
```

## Example Usage

```text
Build a dense admin dashboard for triaging payment disputes.
```

```text
Redesign this settings page so the account and billing flows are easier to scan.
```

```text
Create a product landing page for a hardware developer kit.
```

## Requirements

No API key, account, browser service, or local CLI is required. The skill applies to whatever frontend stack is already present in the workspace, and it should follow the project conventions before introducing new libraries or visual patterns.

## Notes

The plugin does not add browser automation, screenshot capture, asset generation, or a dev server. When those tools already exist in the project or host environment, the skill should use them for visual inspection; otherwise it should state what was verified by code review, build output, or static inspection.
