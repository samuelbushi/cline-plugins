# ui5-typescript-conversion

Guidance for converting SAPUI5 and OpenUI5 JavaScript projects to TypeScript.

## What It Does

Installs the `ui5-typescript-conversion` skill with UI5-specific conversion guidance for project setup, ES module migration, controller and custom control typing, generated control interfaces, and test conversion.

The plugin also bundles a test-conversion reference for QUnit, OPA, and coverage setup patterns, plus a safety rule for package installs, generated files, local scripts, and project rewrites.

## Install

```bash
cline plugin install ui5-typescript-conversion
```

For local development from this repository:

```bash
cline plugin install ./plugins/ui5-typescript-conversion --cwd .
```

## Example Usage

After installation, ask Cline:

```text
Help convert this UI5 JavaScript app to TypeScript, starting with the project setup and a controller.
```

## Requirements

- A SAPUI5 or OpenUI5 JavaScript project.
- Node and the project's package manager when applying dependency or script changes.
- UI5 framework type packages that match the project, such as `@sapui5/types` or `@openui5/types`.
- Existing project files such as `ui5.yaml`, `manifest.json`, and `package.json` to determine the UI5 framework and version.

## Security Notes

Setup only installs bundled guidance and a rule. It does not edit a project, install dependencies, run package scripts, start local servers, or write MCP settings.

Conversion work can touch many source and configuration files, so the skill requires explicit approval before dependency installs, generator runs, type checks, tests, or long-running server/watch commands.

## Attribution

Bundled UI5 conversion guidance is derived from SAP UI5 coding-agent plugin materials, licensed under Apache-2.0. See `LICENSE.ui5-typescript-conversion` and `NOTICE.ui5-typescript-conversion`.
