---
name: math-olympiad
description: Solve or verify competition math problems with rigorous proof construction, adversarial checking, and calibrated abstention.
---

# Math Olympiad

Use this skill for IMO, Putnam, USAMO, AIME, olympiad, contest proof, inequality, number theory, combinatorics, geometry, functional equation, and "is this proof correct?" tasks.

Do not use web search or external solution lookup unless the user explicitly asks for research instead of solving. The default workflow is pure reasoning. Use local computation only for small exploratory checks or arithmetic when it helps find a pattern; never present computation as proof.

## Workflow

1. Restate the problem precisely.
2. Identify possible interpretations. If one reading is trivial and another is hard, solve the intended hard reading and say why.
3. Classify the task:
   - Numeric answer: solve, then verify by independent checks.
   - Proof problem: build a complete argument.
   - Proof verification: skip solving and attack the submitted proof.
4. Generate several approaches before committing:
   - Small cases past the first degenerate case.
   - Invariant or monovariant.
   - Extremal element.
   - Induction.
   - Symmetry and valid WLOG reductions.
   - Work backwards from the desired claim.
   - Drop or weaken a condition to find where the hypothesis is used.
   - Generalize if the broader statement has more structure.
5. Choose the strongest approach and write a clean proof. Remove false starts, private exploration, and unsupported leaps.
6. Run adversarial verification on the clean proof only.
7. If a gap is found, either repair the proof and verify again, or report partial progress.
8. Final answer must be one of:
   - Verified solution.
   - Partial result with exact unproved step.
   - No confident solution.

## Adversarial Verification

Attack the proof with these checks:

- Step does not follow: the conclusion is not implied by the premises.
- Hypothesis mismatch: a cited theorem needs a condition that was not verified.
- Small-case failure: a claimed identity or bound fails at the first nontrivial case.
- Tautology: the remaining "gap" is just the original claim in disguise.
- Proves too much: the argument would also prove a known false or open statement.
- Wrong interpretation: the proof solves an easier reading of the problem.
- WLOG failure: the reduction discards a hard case or changes the problem.
- Hidden regularization: a divergent sum or limiting argument is treated as bounded.
- Hand wave at the crux: "standard", "routine", or "clearly" appears exactly where the main work is.

For each check, quote the exact proof line being tested and decide whether it holds.

## Verification Output

For proof verification tasks, use:

```text
Verdict: correct | incorrect | gap | unclear
Confidence: high | medium | low
Issue:
Repair:
```

For solving tasks, use:

```text
Method:
Proof:
Adversarial checks:
Answer:
Confidence:
```

## Guardrails

- A correct final answer from flawed reasoning is still a failure.
- Do not hide gaps behind polished language.
- Do not cite a theorem without checking its hypotheses.
- Do not infer a pattern from only degenerate small cases.
- For full problem sets, solve and verify one problem at a time; do not blend proof states across problems.
- If the user wants a polished write-up, produce LaTeX after verification passes.
