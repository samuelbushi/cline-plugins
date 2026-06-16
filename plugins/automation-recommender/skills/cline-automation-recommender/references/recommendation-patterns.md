# Recommendation Patterns

Use these as heuristics, not a rigid matrix.

## Common MCP Matches

Use concrete names only when they are verified from local or official Cline context. Otherwise recommend the integration category and tell the user to verify current availability before installing.

| Signal | Consider | Notes |
| --- | --- | --- |
| Popular frameworks or SDKs | Context7 or docs MCP | Best when current API docs reduce hallucinated code. |
| Frontend app or E2E tests | Playwright | Requires a runnable app/browser workflow. |
| Prisma project | Prisma | Useful for schema and migration-aware database work. |
| Supabase project | Supabase | Requires user auth/project access. |
| Convex project | Convex | Useful for function/schema/deployment introspection. |
| PostgreSQL/MySQL/ClickHouse | Database-specific MCP or skill | Be explicit about credentials and read/write risk. |
| GitHub/GitLab repo workflows | GitHub or GitLab | Auth and repo permissions matter. |
| Jira/Linear/Atlassian process | Atlassian or Linear | Useful when work is issue-driven. |
| AWS/Azure/GCP infrastructure | Cloud-specific MCP/plugin | Cloud credentials can be broad; recommend scoped access. |
| Sentry/Datadog/observability config | Observability MCP/plugin | Good for production debugging with account access. |
| Figma/design assets | Figma/design plugin | Requires user account/project access. |

## Good Skill Candidates

| Signal | Skill idea |
| --- | --- |
| API routes or OpenAPI files | API documentation/review skill |
| Database migrations | Migration authoring and review skill |
| Strong test patterns | Test generation or test triage skill |
| Component library | Component scaffolding/review skill |
| Release process | Release notes or changelog skill |
| Project conventions | Project conventions skill |
| Security-sensitive areas | Secure coding review skill |

## Good Hook or Rule Candidates

| Signal | Candidate |
| --- | --- |
| Prettier, ESLint, Ruff, Black, gofmt, rustfmt | Narrow format/lint hook after file edits |
| TypeScript, mypy, pyright | Targeted type-check guidance or hook |
| `.env`, credentials, secrets config | Rule/hook to block secret edits or reads |
| Lock files | Rule/hook to avoid direct manual edits |
| Payments, auth, infra, production data | Rule requiring explicit confirmation before risky changes |
| Focused tests exist | User-triggered command or narrow validation hook |

## Slash Command Ideas

- `/pr-check` for project-specific review checklist.
- `/release-notes` for changelog drafting from git history.
- `/migration-plan` for schema/data migration planning.
- `/api-docs` for endpoint documentation.
- `/test-plan` for targeted test strategy.

## Subagent Workflow Ideas

- Security reviewer for auth, secrets, permissions, or payment flows.
- Performance reviewer for hot paths, large queries, UI rendering, or build speed.
- Accessibility reviewer for UI-heavy apps.
- Test reviewer for coverage gaps and brittle test patterns.
- Explorer for large or unfamiliar codebases.
