---
name: pr-review-comments
description: Review code comments, docs, and inline explanations for factual accuracy, usefulness, maintainability, and comment rot. Use when comments or documentation changed or when the user asks whether comments are accurate.
---

# PR Review Comments

Check whether comments earn their place.

## Review For

- Claims that no longer match the code.
- Comments that describe what the code plainly says instead of why it exists.
- Missing rationale for surprising behavior.
- Temporary notes that will age poorly.
- Documentation that omits constraints, side effects, or failure modes.
- Examples that do not compile, run, or match the current API.
- Comments that encourage unsafe or deprecated usage.

## Method

Read the code around each changed comment. Verify every factual claim against the implementation. If a comment is correct but too vague, suggest the smallest improvement. If it is redundant, recommend removal.

## Output

Group findings as:

- Incorrect or misleading.
- Likely to rot.
- Missing useful context.
- Recommended removal.

Include file and line references when possible. Do not rewrite large docs unless the user asks.
