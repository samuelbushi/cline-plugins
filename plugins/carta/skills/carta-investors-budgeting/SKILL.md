---
name: carta-investors-budgeting
description: Use for Carta Investors budgeting workflows, budget creation, fetching budgets, budget versus actuals, actual refreshes, scenarios, consolidating P&L, consolidating balance sheets, Excel outputs, and workbook generation.
---

# Carta Investors Budgeting

Use this skill for Carta budgeting and accounting workflows.

## Common Workflows

- create a budget from prior-year actuals
- fetch an existing budget from Carta
- refresh actuals into a budget workbook
- compare budget versus actuals
- model budget scenarios such as headcount changes or revenue shocks
- generate consolidating P&L
- generate consolidating balance sheet

## Before Writing Files

Budget workflows often create or update Excel workbooks. Ask before writing files and confirm:

- firm or fund context
- period or fiscal year
- currency
- output path
- whether to update an existing workbook or create a new one

Do not overwrite existing files without approval.

## Output Standards

- Keep workbook filenames descriptive.
- Include assumptions in a visible summary tab or chat summary.
- Separate actuals from budget values.
- Preserve period labels and entity names exactly.
- Flag missing accounts, unmapped categories, and unusual variances.

## Scenario Analysis

Label scenario outputs as Cline analysis unless Carta directly returns the scenario. Include assumptions, changed drivers, and sensitivity notes. Do not present budget scenarios as financial advice.
