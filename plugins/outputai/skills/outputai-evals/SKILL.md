---
name: outputai-evals
description: Design, implement, and audit Output SDK evaluations. Use for datasets, scenarios, evaluator functions, judge prompts, cached eval runs, human labels, and quality failure analysis.
---

# Output.ai Evaluations

Use this skill when output quality matters and needs measurable coverage.

## Eval Strategy

Start from observed or expected failure modes. Do not build a generic judge that says "is this good". Each evaluator should test one clear criterion.

Useful eval layers:

- Scenario files for basic runnable inputs.
- Dataset files for varied examples and cached outputs.
- Runtime evaluators for checks embedded near workflow execution.
- Offline evals with `@outputai/evals` for repeatable quality testing.
- LLM judges only when rule-based checks cannot capture the criterion.

## Dataset Design

Vary inputs along dimensions that target failures:

- Length, language, format, and missing fields.
- Ambiguous or contradictory user requests.
- Empty, edge, and malformed API responses.
- Rare but high-impact business cases.
- Known regressions from production traces.

Each case should include:

- The workflow input.
- Expected output or ground truth labels.
- Which evaluators should pass.
- Notes explaining why the case exists.

## Judge Prompt Rules

- Judge one failure mode per prompt.
- Include the relevant input, output, and ground truth.
- Ask for critique before verdict so the judge explains its decision.
- Keep labels simple and stable.
- Validate against human labels before trusting the judge in CI.
- Use a cheaper model only after it matches human labels well enough for the task.

## Common Commands

Use project scripts when available. Common command shapes:

```bash
npx output workflow dataset list <workflowName>
npx output workflow dataset generate <workflowName> --input '{"key":"value"}' --name <caseName>
npx output workflow test <workflowName> --cached
npx output workflow test <workflowName> --save
npx output workflow test <workflowName> --dataset <caseName>
npx output workflow test <workflowName> --format json
```

Ask before running commands that execute live workflows, call providers, or save fresh outputs.

## Audit Checklist

- Does each evaluator map to a real failure mode?
- Are positive and negative cases both represented?
- Are cached outputs refreshed deliberately after workflow changes?
- Are judges calibrated against human labels?
- Are thresholds documented?
- Can the eval fail for the right reason, or is it only testing happy paths?

When reporting eval work, include what failure mode each evaluator covers and what is still untested.
