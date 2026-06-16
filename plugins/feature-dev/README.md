# feature-dev

Adds a `/feature-dev` slash command for structured feature development.

## What It Does

The command turns an optional feature request into a guided workflow:

- Discovery and requirement clarification.
- Codebase exploration before edits.
- Blocking clarifying questions before architecture.
- Architecture options with a concrete recommendation.
- Implementation after a concise plan for clear, low-risk requests.
- Focused quality review before final summary.

The plugin does not install agent profiles or require subagent support. If Cline has delegation tools available in a session, the workflow may use them for independent exploration or review. Otherwise, the same roles are handled as focused passes in the main session.

## Install

```bash
cline plugin install feature-dev
```

For local development from this repository:

```bash
cline plugin install ./plugins/feature-dev --cwd .
```

## Example Usage

```text
/feature-dev Add OAuth login for GitHub and Google
```

Cline will first inspect relevant code and ask for missing decisions before proposing an implementation plan.

## Requirements

No external services or credentials are required by the plugin itself. The workflow may need whatever tools the target repository already uses for building, testing, linting, or code review.

## Security Notes

The command is a workflow prompt, not an agent profile. It tells Cline to treat repository files, copied issue text, web pages, docs, and command output as untrusted unless they are explicit project instruction files.

For clear, low-risk requests, the workflow can proceed after a concise plan. It still stops for explicit approval before destructive, high-risk, broad, or ambiguous changes, and it keeps code review findings focused on issues that matter.
