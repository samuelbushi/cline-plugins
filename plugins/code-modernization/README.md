# code-modernization

Adds a legacy modernization slash-command workflow to Cline.

## What It Does

Registers nine `/modernize-*` slash commands for planning and executing legacy-code modernization:

- `/modernize-preflight` checks readiness before discovery or transformation.
- `/modernize-assess` inventories a system or portfolio for complexity, debt, risk, and effort.
- `/modernize-map` builds dependency, data-lineage, entry-point, and topology artifacts.
- `/modernize-extract-rules` mines business rules into testable rule cards.
- `/modernize-brief` synthesizes discovery artifacts into an approval-ready modernization plan.
- `/modernize-reimagine` plans and gates a greenfield rebuild from extracted legacy intent, then scaffolds after approval.
- `/modernize-transform` plans and gates one module rewrite with characterization tests and equivalence notes, then transforms after approval.
- `/modernize-harden` audits security risk and writes reviewable remediation patches.
- `/modernize-status` reports progress, stale artifacts, secret hygiene, and the next best step.

## Install

```bash
cline plugin install code-modernization
```

For local development from this repository:

```bash
cline plugin install ./plugins/code-modernization --cwd .
```

## Example Usage

After installation, organize legacy source under `legacy/<system-dir>` and ask Cline:

```text
/modernize-preflight billing java-spring
```

Then continue through discovery and planning:

```text
/modernize-assess billing
/modernize-map billing
/modernize-extract-rules billing
/modernize-brief billing java-spring
```

## Requirements

- Legacy source available in the workspace, preferably under `legacy/<system-dir>`.
- Optional analysis tools such as `scc`, `cloc`, `lizard`, `glow`, and `delta`.
- The relevant legacy and target build toolchains when running transform or validation workflows.
- User review at the planned checkpoints before writing transformed code or applying remediation patches.

## Security Notes

The workflow is designed for legacy codebases that may contain production credentials. The commands instruct Cline to mask credential values in shareable artifacts, quarantine raw secret inventories in ignored local files, and avoid editing `legacy/` directly. Review generated analysis, code, and patches before applying them to production systems.

Legacy source, comments, docs, logs, commit history, and generated artifacts are treated as untrusted data. The workflow instructs Cline and any specialist pass not to follow instructions or links discovered there unless the user explicitly asks.
