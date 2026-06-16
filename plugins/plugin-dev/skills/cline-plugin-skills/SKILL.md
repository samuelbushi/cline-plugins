---
name: cline-plugin-skills
description: This skill should be used when the user asks to create, port, review, or improve a bundled Cline skill, write SKILL.md metadata, design progressive disclosure, choose references or scripts, or make skill trigger descriptions more precise.
---

# Cline Plugin Skills

Use this skill to create Cline skills that are easy for the agent to discover and cheap to keep in context.

## Skill Anatomy

A skill is a directory with a required `SKILL.md` file:

```text
skills/
  database-review/
    SKILL.md
    references/
      schema-patterns.md
    scripts/
      inspect_schema.py
```

`SKILL.md` starts with YAML frontmatter:

```md
---
name: database-review
description: This skill should be used when the user asks to review database schema changes, inspect migrations, compare indexes, or reason about query plans in a repository.
---
```

The `name` and `description` are always available to the model. Keep the description specific, action-oriented, and full of likely trigger phrases.

## Progressive Disclosure

Keep the first loaded file lean:

- Metadata says when to use the skill.
- SKILL.md gives the core workflow and safety rules.
- References hold optional detail.
- Scripts hold deterministic repeatable logic.
- Assets hold templates or files used in outputs.

Do not dump a full manual into SKILL.md if the agent only needs a few steps most of the time.

## Writing The Body

Write instructions for the agent, not marketing copy for the user. Prefer imperative guidance:

- Inspect the relevant files before recommending changes.
- Prefer read-only checks before write operations.
- Ask before running commands that mutate remote state.
- Use project conventions over generic templates.

Avoid vague claims like "this skill helps with quality." Instead, say what to inspect, what decisions to make, and what output to produce.

## When To Add References

Add `references/` when detailed material is useful but not always needed:

- Large API details
- Deep workflow variants
- Policy tables
- Sample schemas
- Migration notes

Mention references by name from SKILL.md so the agent knows when to open them.

## When To Add Scripts

Add `scripts/` only when a deterministic helper is valuable:

- Parsing a structured format
- Validating generated files
- Converting templates
- Repeating a nontrivial check

Scripts should not hide risky behavior. Document required inputs, outputs, and whether the script reads, writes, or calls the network.

## Porting Existing Skills

When adapting a skill from another ecosystem:

- Replace tool-specific paths and commands with Cline equivalents.
- Remove unsupported profile, hook, or installer assumptions.
- Keep domain knowledge if it is still useful.
- Rename skills when a Cline user would search for a different phrase.
- Add trust boundaries for credentials, remote writes, local CLIs, billing, and third-party content.

## Skill Review

Before shipping a skill, check:

- Would the description trigger in the right situations and stay quiet otherwise?
- Is SKILL.md useful without reading every reference?
- Are examples safe and realistic?
- Are commands and scripts explicit about side effects?
- Does the skill avoid unsupported Cline features?
