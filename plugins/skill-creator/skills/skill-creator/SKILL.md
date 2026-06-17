---
name: skill-creator
description: Create, improve, validate, package, and review Cline skills. Use when a user wants to turn a workflow into a skill, edit an existing SKILL.md, design skill eval prompts, compare skill output quality, package a skill folder, or improve when a skill should trigger.
---

# Skill Creator

Use this skill when the user wants to create a new Cline skill, improve an
existing one, build lightweight evals around a skill, or package a skill for
sharing. Preserve the user's workflow details. A good skill captures exact
steps, examples, helper scripts, references, and constraints that would be easy
to lose in a short summary.

Treat existing skill folders and bundled resources as source material. Read
them directly before editing. Do not replace a detailed skill with a condensed
rewrite unless the original is unusable or the user explicitly asks for a
smaller version.

## Operating Model

Work in this order unless the user asks for something narrower:

1. Capture intent and constraints.
2. Draft or edit the skill folder.
3. Add useful references, scripts, templates, or examples.
4. Validate the skill locally.
5. Create a small eval set and run the most practical checks.
6. Review results with the user and iterate.
7. Package the final skill if the user wants a distributable artifact.

Keep network calls, package installs, shell scripts, browser launches, and writes
outside the skill directory explicit. Ask before running generated code or
third-party tooling unless the user has already clearly approved that exact
action.

## Capture Intent

Start by understanding what the user wants the skill to preserve.

- What should the skill help Cline do?
- When should it trigger?
- What inputs, files, tools, APIs, or accounts does it depend on?
- What output shape should it produce?
- What examples from the current conversation or workspace are canonical?
- What should it avoid doing without explicit confirmation?
- Should there be tests or eval prompts?

If the current conversation already contains the workflow, extract what you can
before asking questions. Ask only for missing details that materially affect the
skill.

## Skill Anatomy

A Cline skill is a directory with a required `SKILL.md` and optional bundled
resources:

```text
skill-name/
  SKILL.md
  references/
  scripts/
  assets/
```

The `SKILL.md` frontmatter needs at least:

```yaml
---
name: skill-name
description: What the skill does and when Cline should use it.
---
```

Use kebab-case names. Keep the description specific enough to trigger when the
workflow is useful, but narrow enough that it does not hijack adjacent tasks.
Put trigger guidance in the description, not only in the body.

## Progressive Disclosure

Keep the main `SKILL.md` focused on the routing and workflow. Move large
material into bundled resources and tell the model when to read them.

Good patterns:

- Put API tables, schemas, long examples, and troubleshooting guides in
  `references/`.
- Put deterministic transformations or repeatable checks in `scripts/`.
- Put templates, sample files, images, or fixtures in `assets/`.
- Add a short table of contents to any reference file longer than a few hundred
  lines.
- For multi-framework skills, create one reference file per framework and route
  to only the relevant file.

The goal is to load detailed context only when it is needed.

## Writing Guidelines

Write instructions as practical guidance for another agent:

- Explain why a step matters when the reason changes behavior.
- Prefer precise examples over vague rules.
- Include expected output formats when consistency matters.
- Include failure and fallback behavior for common edge cases.
- Identify trust boundaries around credentials, destructive commands, paid API
  calls, public posting, deploys, and data export.
- Keep the skill general enough to work beyond the initial examples.

Avoid hidden behavior. A user installing a skill should not be surprised by
network calls, background processes, credential writes, broad filesystem scans,
or destructive changes.

## Editing Existing Skills

When improving an existing skill:

1. Read the current `SKILL.md` completely.
2. Inspect referenced files before deciding they are obsolete.
3. Preserve the skill name unless the user explicitly wants a rename.
4. Copy the original to a temporary snapshot if you need to compare versions.
5. Make the smallest edit that fixes the real issue.
6. Re-run validation and any relevant eval prompts.

Look for repeated work in test runs. If the agent keeps writing the same helper
script or template, bundle that resource into the skill and point to it.

## Test Prompts And Evals

Create 2-3 realistic test prompts for early iteration. Make them look like real
user requests, including file paths, rough phrasing, incomplete context, and
edge cases when relevant.

Store prompts in `evals/evals.json` when the user wants a persistent eval set:

```json
{
  "skill_name": "example-skill",
  "evals": [
    {
      "id": 1,
      "prompt": "User task prompt",
      "expected_output": "Description of what a good answer should produce",
      "files": [],
      "expectations": []
    }
  ]
}
```

Read `references/schemas.md` for the full schema when generating benchmark or
grading files.

## Practical Evaluation In Cline

Use the most practical evaluation strategy for the current environment:

- For simple changes, run the skill manually against one or two prompts and
  inspect the result.
- For file-producing skills, save outputs in a workspace directory such as
  `<skill-name>-workspace/iteration-1/eval-<name>/outputs/`.
- For objective checks, write small scripts or expectations rather than relying
  only on visual inspection.
- For qualitative skills, show outputs to the user and ask targeted questions.
- If Cline subagents are available and the user wants a stronger comparison,
  run one pass with the skill and one baseline pass without it or with the old
  version. Keep the runs isolated and compare outputs afterward.

Do not claim that a skill is benchmarked unless the supporting artifacts exist.
If timing or token metrics are unavailable, omit them instead of inventing them.

## Grading And Comparison

The bundled `agents/` files are reference rubrics, not automatically installed
agent profiles:

- `agents/grader.md` explains how to grade expectations against transcripts and
  output files.
- `agents/comparator.md` explains blind A/B comparison.
- `agents/analyzer.md` explains how to analyze why one version performed
  better.

Use these files as written instructions when grading inline, or provide them to
a Cline subagent only when subagents are available and the user approved that
workflow.

## Local Utilities

This skill includes local helper scripts:

- `scripts/quick_validate.py` validates basic `SKILL.md` frontmatter.
- `scripts/package_skill.py` packages a skill directory into a `.skill` zip.
- `scripts/aggregate_benchmark.py` aggregates manually produced grading and
  timing files into benchmark artifacts.
- `eval-viewer/generate_review.py` can generate a review UI. In headless or
  remote environments, prefer its `--static` mode so the user can open the HTML
  file themselves.

Run scripts from the `skill-creator` directory so relative imports resolve:

```bash
python3 -m scripts.quick_validate /path/to/skill
python3 -m scripts.package_skill /path/to/skill /path/to/output
python3 -m scripts.aggregate_benchmark /path/to/iteration --skill-name skill-name
python3 eval-viewer/generate_review.py /path/to/iteration --skill-name skill-name --static /tmp/skill-review.html
```

Before running bundled scripts, explain what they read and write. Do not run
generated scripts or third-party code without explicit user approval.

## Description Improvement

A skill description should help Cline choose the skill for relevant tasks and
ignore near-misses.

To improve a description manually:

1. Write 8-10 should-trigger prompts and 8-10 should-not-trigger prompts.
2. Include realistic, messy, concrete user wording.
3. Make negative examples close enough to test over-triggering.
4. Rewrite the description to name the real workflow and the strongest trigger
   cues.
5. Keep the description under the host's length limit and avoid generic
   keywords that would match too broadly.

Do not run automated model-based description optimization unless the user asks
for it and the required CLI/model setup is available. If you do run an optimizer,
keep its temporary files outside the user's project unless they choose a path.

## Package And Present

Before packaging:

1. Validate the skill.
2. Remove local eval outputs, logs, caches, and temporary files.
3. Confirm bundled scripts/assets are intentional.
4. Confirm license or attribution files are present when needed.

Package with:

```bash
python3 -m scripts.package_skill /path/to/skill-folder /path/to/output-directory
```

Return the resulting `.skill` path and summarize the important requirements,
trust boundaries, and suggested first prompt.
