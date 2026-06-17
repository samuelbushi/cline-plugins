---
name: zapier-tool-profile
description: Create or update user-approved project guidance describing the user's configured Zapier MCP actions. Use after Zapier actions are already connected and the user asks to create, update, personalize, or document their Zapier tools.
---

# Zapier Tool Profile

Create project guidance that tells future Cline sessions which Zapier actions are configured and when to use them.

## Cline Compatibility

Do not write persistent guidance until the user approves the destination path. Prefer project-local guidance when the user wants behavior only for the current repository. Preserve user edits when updating an existing profile.

## Prerequisites

Only continue if useful Zapier actions exist.

- In Agentic mode, inventory enabled actions with the Zapier action-listing tool.
- In Classic mode, inspect the visible Zapier action tools.
- If no actions exist, stop and run `zapier-setup` first.

## Step 1: Inventory Actions

For each action, capture:

- App name.
- Human action name.
- Technical action identifier or tool name.
- Read or write classification.
- One-sentence practical use case.

Exclude generic Zapier configuration, discovery, feedback, and skill-management meta-tools from the profile. Include the user's enabled app actions.

## Step 2: Ask For Role Context

Ask one short question:

"What role or workflow should this profile optimize for?"

Examples: engineering, product management, sales, support, recruiting, operations. If the user says to decide yourself, use the connected apps and current project context.

## Step 3: Choose Destination

Offer a project-local guidance file by default:

```text
.cline/rules/my-zapier-tools.md
```

If the repository already uses a different Cline guidance convention, follow that convention. Ask before writing to global or home-directory locations.

## Step 4: Write The Profile

Use this structure:

```markdown
# My Zapier Tools

These Zapier actions are available in this project.

## Available Actions

### App Name

- Action name (`technical_identifier`): when to use it.

## When To Use Zapier

Short guidance tailored to the user's role and connected apps.

## Safety Preferences

- Use read actions when they directly support the user's request.
- Confirm before write actions.
- Show important payload fields before writes.
- Prefer native MCP servers for single-app workflows when they are available and better suited.
```

Keep descriptions specific. "Find Jira issues by key for sprint status checks" is better than "Find issue".

## Step 5: Update Existing Profiles

If a profile already exists:

1. Read it first.
2. Inventory current Zapier actions.
3. Add new actions.
4. Remove or mark missing actions only after confirming with the user.
5. Preserve custom preferences and role notes when possible.

Finish by summarizing the file path and what changed.
