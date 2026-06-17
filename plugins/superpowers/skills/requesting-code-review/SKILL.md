---
name: superpowers:requesting-code-review
description: Use when completing tasks, implementing major features, or before merging to verify work meets requirements
---

# Requesting Code Review

Dispatch a code reviewer subagent to catch issues before they cascade. The reviewer gets precisely crafted context for evaluation - never your session's history. This keeps the reviewer focused on the work product, not your thought process, and preserves your own context for continued work.

__Core principle:__ Review early, review often.

## Cline Compatibility

Use a Cline subagent only when the active host exposes subagent support. If it does not, use `code-reviewer.md` as a checklist for a self-review or ask the user how they want review handled. Do not pretend a self-review is an independent subagent review.

## When to Request Review

__Mandatory:__
- After each task in subagent-driven development
- After completing major feature
- Before merge to main

__Optional but valuable:__
- When stuck (fresh perspective)
- Before refactoring (baseline check)
- After fixing complex bug

## How to Request

__1. Get git SHAs:__
```bash
BASE_SHA=$(git rev-parse HEAD~1)  # or origin/main
HEAD_SHA=$(git rev-parse HEAD)
```

__2. Dispatch code reviewer subagent:__

Use Task tool with `general-purpose` type, fill template at `code-reviewer.md`

__Placeholders:__
- `{DESCRIPTION}` - Brief summary of what you built
- `{PLAN_OR_REQUIREMENTS}` - What it should do
- `{BASE_SHA}` - Starting commit
- `{HEAD_SHA}` - Ending commit

__3. Act on feedback:__
- Fix Critical issues immediately
- Fix Important issues before proceeding
- Note Minor issues for later
- Push back if reviewer is wrong (with reasoning)

## Example

```
[Just completed Task 2: Add verification function]

You: Let me request code review before proceeding.

BASE_SHA=$(git log --oneline | grep "Task 1" | head -1 | awk '{print $1}')
HEAD_SHA=$(git rev-parse HEAD)

[Dispatch code reviewer subagent]
  DESCRIPTION: Added verifyIndex() and repairIndex() with 4 issue types
  PLAN_OR_REQUIREMENTS: Task 2 from docs/superpowers/plans/deployment-plan.md
  BASE_SHA: a7981ec
  HEAD_SHA: 3df7661

[Subagent returns]:
  Strengths: Clean architecture, real tests
  Issues:
    Important: Missing progress indicators
    Minor: Magic number (100) for reporting interval
  Assessment: Ready to proceed

You: [Fix progress indicators]
[Continue to Task 3]
```

## Integration with Workflows

__Subagent-Driven Development:__
- Review after EACH task
- Catch issues before they compound
- Fix before moving to next task

__Executing Plans:__
- Review after each task or at natural checkpoints
- Get feedback, apply, continue

__Ad-Hoc Development:__
- Review before merge
- Review when stuck

## Red Flags

__Never:__
- Skip review because "it's simple"
- Ignore Critical issues
- Proceed with unfixed Important issues
- Argue with valid technical feedback

__If reviewer wrong:__
- Push back with technical reasoning
- Show code/tests that prove it works
- Request clarification

See template at: requesting-code-review/code-reviewer.md
