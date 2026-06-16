---
name: agentforce-develop
description: Use this skill when designing, authoring, validating, previewing, deploying, publishing, or activating Salesforce Agentforce Agent Script authoring bundles.
---

# Agentforce Develop

Use this skill for Salesforce Agentforce agent development with Agent Script and `AiAuthoringBundle` metadata.

## Guardrails

- Treat Agent Script as its own language. Do not confuse it with JavaScript, Python, Apex, AppleScript, or YAML.
- Prefer `sf` commands with `--json` and read the full JSON response directly.
- Prefer `ctx.workspaceInfo` and the user's current project structure when reasoning about files. Do not assume `process.cwd()` is the Salesforce project root.
- Verify the target org before any org interaction with `sf config get target-org --json` or an explicit `-o <alias>`.
- Keep normal work in draft iteration. Do not publish or activate unless the user explicitly asks for release and approves the exact target org and agent name.
- Do not create `.agent` or `bundle-meta.xml` files entirely by hand when the Salesforce CLI can generate the authoring bundle.
- When designing actions, default unknown implementations to placeholders until the user chooses whether to reuse existing Apex, Flow, prompt templates, external services, or generate new code.

## Development Flow

1. Clarify the agent goal, users, channels, supported tasks, unavailable tasks, data sources, and success criteria.
2. Draft an Agent Spec in a project file and stop for user approval before implementation.
3. Confirm Salesforce prerequisites: target org, Agentforce access, API version, project shape, and required permissions.
4. Generate an authoring bundle with:

```bash
sf agent generate authoring-bundle --json --no-spec --name "<Label>" --api-name <Developer_Name> -o <org_alias>
```

5. Edit the generated `.agent` file in draft form. Keep subagent instructions distinct and simple.
6. Validate before preview:

```bash
sf agent validate authoring-bundle --json --api-name <Developer_Name> -o <org_alias>
```

7. Preview without live actions first:

```bash
sf agent preview start --json --authoring-bundle <Developer_Name> -o <org_alias>
sf agent preview send --json --authoring-bundle <Developer_Name> --session-id <session_id> -u "<utterance>" -o <org_alias>
sf agent preview end --json --authoring-bundle <Developer_Name> --session-id <session_id> -o <org_alias>
```

8. Use `--use-live-actions` only after the user approves exercising real org actions.
9. Inspect trace files and fix behavior against the approved Agent Spec.
10. For release, require explicit approval, a clean validation result, realistic preview coverage, and confirmation that the target org is correct.

## Agent Script Checks

- Avoid nested `if` blocks and `else if` chains unless the installed Agent Script version explicitly supports them.
- Keep each subagent focused on one responsibility.
- Use deterministic guardrails for compliance, safety, or business-critical constraints. Keep general conversation behavior flexible.
- Confirm actions are actually invoked in traces instead of trusting the preview response text.
- Before modifying action implementations, inspect existing `@InvocableMethod` Apex, Flow metadata, prompt templates, and external service registrations if the user wants reuse.

## Common Commands

Use these as starting points and adapt paths, org aliases, and API names to the project:

```bash
sf config get target-org --json
sf project retrieve start --json --metadata "AiAuthoringBundle:<Developer_Name>" -o <org_alias>
sf agent validate authoring-bundle --json --api-name <Developer_Name> -o <org_alias>
sf agent preview start --json --authoring-bundle <Developer_Name> -o <org_alias>
sf agent publish authoring-bundle --json --api-name <Developer_Name> -o <org_alias>
sf agent activate --json --api-name <Developer_Name> -o <org_alias>
```

Only run publish or activate commands after the user confirms the release target.
