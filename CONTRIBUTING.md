# Contributing

This repository is a curated collection. PRs should add one focused plugin per directory.

## Plugin Layout

- Put each plugin in `plugins/<slug>`.
- Use lowercase kebab-case slugs only.
- The slug is the install keyword for `cline plugin install <slug>`.
- Include a `README.md` with install steps, requirements, security notes, and examples.
- Use `index.ts` for single-entry plugins.
- If a plugin needs npm dependencies, include a `package.json` with `cline.plugins` pointing to the entry file.

## Review Checklist

- The plugin has a clear user-facing purpose.
- Required environment variables and external services are documented.
- Hooks that block, rewrite, read, write, or run commands explain the safety behavior.
- Tools validate inputs before touching files, shell commands, or network APIs.
- No secrets, `.env` files, `node_modules`, build output, or generated logs are committed.

## Validate

```bash
npm run validate
```

The validation script checks slugs, required files, package metadata, and common unsafe committed artifacts.

