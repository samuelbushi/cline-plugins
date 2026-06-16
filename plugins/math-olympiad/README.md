# math-olympiad

Adds a competition math skill for solving and checking IMO, Putnam, USAMO, AIME, and similar problems with adversarial proof verification.

## What It Does

The plugin bundles the `math-olympiad` skill. It guides Cline through:

- Interpreting the problem before solving.
- Trying multiple proof angles instead of locking onto the first idea.
- Writing a clean proof separate from exploratory reasoning.
- Running adversarial verification passes that look for specific proof failures.
- Returning partial progress or `no confident solution` when a proof does not survive review.

It also adds a prompt rule that blocks external solution lookup as the default behavior for competition math tasks.

## Install

```bash
cline plugin install math-olympiad
```

For local development from this repository:

```bash
cline plugin install ./plugins/math-olympiad --cwd .
```

## Requirements

No accounts, API keys, MCP servers, or local CLIs are required.

The workflow is pure reasoning by default. Local computation may be useful for tiny exploratory checks or arithmetic, but it is not a proof and should not replace a rigorous argument.

## Trust Boundary

Do not use web search, published-solution lookup, or problem database lookup unless the user explicitly asks for research instead of solving. When the proof is incomplete, say so directly and keep partial results separate from verified claims.
