---
name: amplitude-experiments
description: Design, monitor, and interpret Amplitude experiments. Use when the user asks about experiment setup, running tests, statistical significance, guardrail metrics, rollout decisions, stale experiments, or ship/no-ship recommendations.
---

# Amplitude Experiments

Use this skill for Amplitude Experiment work: design, monitoring, result interpretation, and decision memos.

## Workflow

1. Identify the experiment by URL, ID, name, flag, or product area. Search if the user gives only a description.
2. Retrieve experiment setup: hypothesis, variants, allocation, exposure, targeting, dates, primary metric, guardrails, and status.
3. Query results with the primary metric first. Add secondary and guardrail metrics only after the primary read is understood.
4. Check statistical validity before making a recommendation. Look at sample size, exposure balance, metric quality, confidence, novelty effects, multiple comparisons, and segment consistency.
5. Investigate segments only when they could change the decision. Do not slice endlessly looking for a win.
6. Check feedback, deployments, and known incidents when results are surprising or when guardrails moved.
7. Make a call: ship, iterate, extend, stop, or rerun. Explain the conditions behind the call.

## Design Guidance

- Tie the primary metric directly to the hypothesis.
- Pick guardrails that protect user experience and business risk.
- Define minimum detectable effect, ramp plan, and decision threshold before launch.
- Avoid too many variants when traffic is limited.
- Avoid changing metrics mid-test unless the original setup is invalid.

## Monitoring Guidance

- Flag stale experiments that have enough evidence but no decision.
- Flag tests running too long without enough traffic.
- Flag guardrail regressions even when the primary metric improves.
- Call out underpowered wins, novelty spikes, and segment-only wins as lower confidence.

Ask before creating, editing, stopping, or launching experiments.
