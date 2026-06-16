---
name: carta-compensation-benchmarks
description: Use for Carta compensation benchmarks, role classification, salary, equity, total cash benchmarks, CTC taxonomy mapping, cap structure benchmarks, option pool benchmarks, SAFE terms, and market comparison questions.
---

# Carta Compensation Benchmarks

Use this skill when the user asks for compensation or market benchmark data from Carta.

## Choose The Path

| Request | Path |
| --- | --- |
| "What does this role map to?" | role classification |
| salary, equity, or total cash ranges | compensation benchmarks |
| option pool, SAFE terms, cap structure norms | market benchmarks |
| fund performance benchmarks | investors reporting, not this skill |

## Role Classification

For job titles or descriptions, classify into Carta's compensation taxonomy before fetching benchmark data. If the role is ambiguous, ask one clarifying question or mark the uncertain field as unknown.

For user-facing output, use readable display values. Keep API enum values only inside tool arguments.

## Benchmark Retrieval

Fetch salary, equity, and total cash when available. For equity, state whether the view is a four-year grant, annual vesting, share count, fully diluted percentage, or notional value.

## Output

- Show percentiles such as P25, P50, P75, and P90 when returned.
- Include benchmark cohort, geography, company stage, valuation range, release date, and sample caveats when available.
- Do not recommend a final offer, comp decision, or employment action as advice. Present benchmark data and explain tradeoffs.

## Exports

Ask before writing CSV, JSON, or spreadsheet outputs. Keep exported files scoped to the requested roles and avoid personal data unless the user explicitly requested it and has permission.
