# Routing Decision Examples

Principle: only Snowflake operations should go to Cortex Code. Everything else
stays in Cline.

## Route To Cortex Code

### Explicit Snowflake Query

User: "Show me all tables in my Snowflake database"

Confidence: 95%. The user explicitly mentions Snowflake.

### Cortex AI Feature

User: "Use Cortex Search to find documents about customer retention"

Confidence: 98%. Cortex Search is a Snowflake Cortex AI feature.

### Data Quality

User: "Check data quality for the SALES_DATA table"

Confidence: 85% when recent context is Snowflake or the user is working in a
Snowflake account.

### ML Function

User: "Create a forecasting model for sales trends"

Confidence: 70% without context. Ask whether the user means Snowflake Cortex
ML or a local/general ML workflow.

### Dynamic Tables

User: "Create a dynamic table that refreshes hourly with top customers"

Confidence: 90%. Dynamic tables are Snowflake-specific enough to suggest
Cortex Code, but ask before write operations.

### Data Governance

User: "Show me the governance policies for sensitive columns"

Confidence: 80% when the active conversation is about Snowflake schemas,
roles, databases, or warehouses.

## Ambiguous Cases

### Generic Data Quality

User: "Check data quality"

Confidence: 50%. Check recent context. If none exists, ask the user whether to
use Snowflake Cortex Code or normal Cline analysis.

### Generic SQL

User: "Run this SQL query: SELECT * FROM users"

Confidence: 50%. Ask which database or connection to use.

## Decision Tree

```text
User request
  Mentions Snowflake or Cortex?
    Yes -> Cortex Code
  Mentions local files, git, builds, tests, or web app work?
    Yes -> Cline
  Mentions a non-Snowflake database?
    Yes -> Cline
  Mentions data quality, governance, ML, SQL, schemas, or tables?
    Recent Snowflake context -> suggest Cortex Code
    No clear context -> ask user
  Otherwise
    Default to Cline
```

## Confidence Thresholds

| Range | Action |
|-------|--------|
| 95%+ | Suggest Cortex Code immediately. |
| 80-94% | Suggest Cortex Code and mention why. |
| 70-79% | Consider asking first. |
| 50-69% | Ask for clarification. |
| <50% | Keep the task in Cline. |
