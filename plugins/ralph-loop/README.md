# ralph-loop

Run a bounded Ralph-style iterative loop in the current Cline session.

## What It Does

Ralph loop repeatedly queues the same task prompt after each completed Cline run. Each iteration sees the workspace state left by the previous iteration, so Cline can refine code, rerun checks, fix failures, and continue toward a clear stopping condition.

This is a Cline-native version of the Ralph technique. It does not install shell hooks, block process exit, or run an external infinite loop.

## Cline Primitives

- Commands: `/ralph-loop` starts, checks, or cancels a loop; `/cancel-ralph` cancels the active loop.
- Hook: an `afterRun` hook queues the next iteration when the current run completes and the loop has not stopped.
- Rule: active-loop guidance reminds Cline to treat each queued turn as the same task and to use the completion promise only when it is true.

## Install

```bash
cline plugin install ralph-loop
```

For local development from this repository:

```bash
cline plugin install ./plugins/ralph-loop --cwd .
```

## Example Usage

```text
/ralph-loop "Add tests for the cache layer, run them, and fix failures. Output <promise>TESTS PASS</promise> when the cache tests pass." --max-iterations 5 --completion-promise "TESTS PASS"
```

Useful follow-ups:

```text
/ralph-loop status
/cancel-ralph
```

## Requirements

No external runtime is required. The loop stores small session state under Cline's data directory.

## Safety Notes

The loop is bounded by `--max-iterations` and defaults to 5 iterations. The plugin rejects requested iteration counts above 50 and does not support an unbounded default. Use it only for tasks with clear success criteria and avoid production debugging or workflows that require ongoing human judgment.

The plugin does not grant tool permissions. Any file edits, commands, network calls, package installs, commits, or deploys still go through Cline's normal tool flow and user approvals.
