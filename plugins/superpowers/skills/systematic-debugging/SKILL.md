---
name: superpowers:systematic-debugging
description: Use when encountering any bug, test failure, or unexpected behavior, before proposing fixes
---

# Systematic Debugging

## Overview

Random fixes waste time and create new bugs. Quick patches mask underlying issues.

__Core principle:__ ALWAYS find root cause before attempting fixes. Symptom fixes are failure.

__Violating the letter of this process is violating the spirit of debugging.__

## The Iron Law

```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

If you haven't completed Phase 1, you cannot propose fixes.

## When to Use

Use for ANY technical issue:
- Test failures
- Bugs in production
- Unexpected behavior
- Performance problems
- Build failures
- Integration issues

__Use this ESPECIALLY when:__
- Under time pressure (emergencies make guessing tempting)
- "Just one quick fix" seems obvious
- You've already tried multiple fixes
- Previous fix didn't work
- You don't fully understand the issue

__Don't skip when:__
- Issue seems simple (simple bugs have root causes too)
- You're in a hurry (rushing guarantees rework)
- Manager wants it fixed NOW (systematic is faster than thrashing)

## The Four Phases

You MUST complete each phase before proceeding to the next.

### Phase 1: Root Cause Investigation

__BEFORE attempting ANY fix:__

1. __Read Error Messages Carefully__
   - Don't skip past errors or warnings
   - They often contain the exact solution
   - Read stack traces completely
   - Note line numbers, file paths, error codes

2. __Reproduce Consistently__
   - Can you trigger it reliably?
   - What are the exact steps?
   - Does it happen every time?
   - If not reproducible → gather more data, don't guess

3. __Check Recent Changes__
   - What changed that could cause this?
   - Git diff, recent commits
   - New dependencies, config changes
   - Environmental differences

4. __Gather Evidence in Multi-Component Systems__

   __WHEN system has multiple components (CI → build → signing, API → service → database):__

   __BEFORE proposing fixes, add diagnostic instrumentation:__
   ```
   For EACH component boundary:
     - Log what data enters component
     - Log what data exits component
     - Verify environment/config propagation
     - Check state at each layer

   Run once to gather evidence showing WHERE it breaks
   THEN analyze evidence to identify failing component
   THEN investigate that specific component
   ```

   __Example (multi-layer system):__
   ```bash
   # Layer 1: Workflow
   echo "=== Secrets available in workflow: ==="
   echo "IDENTITY: ${IDENTITY:+SET}${IDENTITY:-UNSET}"

   # Layer 2: Build script
   echo "=== Env vars in build script: ==="
   env | grep IDENTITY || echo "IDENTITY not in environment"

   # Layer 3: Signing script
   echo "=== Keychain state: ==="
   security list-keychains
   security find-identity -v

   # Layer 4: Actual signing
   codesign --sign "$IDENTITY" --verbose=4 "$APP"
   ```

   __This reveals:__ Which layer fails (secrets → workflow ✓, workflow → build ✗)

5. __Trace Data Flow__

   __WHEN error is deep in call stack:__

   See `root-cause-tracing.md` in this directory for the complete backward tracing technique.

   __Quick version:__
   - Where does bad value originate?
   - What called this with bad value?
   - Keep tracing up until you find the source
   - Fix at source, not at symptom

### Phase 2: Pattern Analysis

__Find the pattern before fixing:__

1. __Find Working Examples__
   - Locate similar working code in same codebase
   - What works that's similar to what's broken?

2. __Compare Against References__
   - If implementing pattern, read reference implementation COMPLETELY
   - Don't skim - read every line
   - Understand the pattern fully before applying

3. __Identify Differences__
   - What's different between working and broken?
   - List every difference, however small
   - Don't assume "that can't matter"

4. __Understand Dependencies__
   - What other components does this need?
   - What settings, config, environment?
   - What assumptions does it make?

### Phase 3: Hypothesis and Testing

__Scientific method:__

1. __Form Single Hypothesis__
   - State clearly: "I think X is the root cause because Y"
   - Write it down
   - Be specific, not vague

2. __Test Minimally__
   - Make the SMALLEST possible change to test hypothesis
   - One variable at a time
   - Don't fix multiple things at once

3. __Verify Before Continuing__
   - Did it work? Yes → Phase 4
   - Didn't work? Form NEW hypothesis
   - DON'T add more fixes on top

4. __When You Don't Know__
   - Say "I don't understand X"
   - Don't pretend to know
   - Ask for help
   - Research more

### Phase 4: Implementation

__Fix the root cause, not the symptom:__

1. __Create Failing Test Case__
   - Simplest possible reproduction
   - Automated test if possible
   - One-off test script if no framework
   - MUST have before fixing
   - Use the `superpowers:test-driven-development` skill for writing proper failing tests

2. __Implement Single Fix__
   - Address the root cause identified
   - ONE change at a time
   - No "while I'm here" improvements
   - No bundled refactoring

3. __Verify Fix__
   - Test passes now?
   - No other tests broken?
   - Issue actually resolved?

4. __If Fix Doesn't Work__
   - STOP
   - Count: How many fixes have you tried?
   - If < 3: Return to Phase 1, re-analyze with new information
   - __If ≥ 3: STOP and question the architecture (step 5 below)__
   - DON'T attempt Fix #4 without architectural discussion

5. __If 3+ Fixes Failed: Question Architecture__

   __Pattern indicating architectural problem:__
   - Each fix reveals new shared state/coupling/problem in different place
   - Fixes require "massive refactoring" to implement
   - Each fix creates new symptoms elsewhere

   __STOP and question fundamentals:__
   - Is this pattern fundamentally sound?
   - Are we "sticking with it through sheer inertia"?
   - Should we refactor architecture vs. continue fixing symptoms?

   __Discuss with your human partner before attempting more fixes__

   This is NOT a failed hypothesis - this is a wrong architecture.

## Red Flags - STOP and Follow Process

If you catch yourself thinking:
- "Quick fix for now, investigate later"
- "Just try changing X and see if it works"
- "Add multiple changes, run tests"
- "Skip the test, I'll manually verify"
- "It's probably X, let me fix that"
- "I don't fully understand but this might work"
- "Pattern says X but I'll adapt it differently"
- "Here are the main problems: [lists fixes without investigation]"
- Proposing solutions before tracing data flow
- __"One more fix attempt" (when already tried 2+)__
- __Each fix reveals new problem in different place__

__ALL of these mean: STOP. Return to Phase 1.__

__If 3+ fixes failed:__ Question the architecture (see Phase 4.5)

## your human partner's Signals You're Doing It Wrong

__Watch for these redirections:__
- "Is that not happening?" - You assumed without verifying
- "Will it show us...?" - You should have added evidence gathering
- "Stop guessing" - You're proposing fixes without understanding
- "Ultrathink this" - Question fundamentals, not just symptoms
- "We're stuck?" (frustrated) - Your approach isn't working

__When you see these:__ STOP. Return to Phase 1.

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "Issue is simple, don't need process" | Simple issues have root causes too. Process is fast for simple bugs. |
| "Emergency, no time for process" | Systematic debugging is FASTER than guess-and-check thrashing. |
| "Just try this first, then investigate" | First fix sets the pattern. Do it right from the start. |
| "I'll write test after confirming fix works" | Untested fixes don't stick. Test first proves it. |
| "Multiple fixes at once saves time" | Can't isolate what worked. Causes new bugs. |
| "Reference too long, I'll adapt the pattern" | Partial understanding guarantees bugs. Read it completely. |
| "I see the problem, let me fix it" | Seeing symptoms ≠ understanding root cause. |
| "One more fix attempt" (after 2+ failures) | 3+ failures = architectural problem. Question pattern, don't fix again. |

## Quick Reference

| Phase | Key Activities | Success Criteria |
|-------|---------------|------------------|
| __1. Root Cause__ | Read errors, reproduce, check changes, gather evidence | Understand WHAT and WHY |
| __2. Pattern__ | Find working examples, compare | Identify differences |
| __3. Hypothesis__ | Form theory, test minimally | Confirmed or new hypothesis |
| __4. Implementation__ | Create test, fix, verify | Bug resolved, tests pass |

## When Process Reveals "No Root Cause"

If systematic investigation reveals issue is truly environmental, timing-dependent, or external:

1. You've completed the process
2. Document what you investigated
3. Implement appropriate handling (retry, timeout, error message)
4. Add monitoring/logging for future investigation

__But:__ 95% of "no root cause" cases are incomplete investigation.

## Supporting Techniques

These techniques are part of systematic debugging and available in this directory:

- __`root-cause-tracing.md`__ - Trace bugs backward through call stack to find original trigger
- __`defense-in-depth.md`__ - Add validation at multiple layers after finding root cause
- __`condition-based-waiting.md`__ - Replace arbitrary timeouts with condition polling

__Related skills:__
- __superpowers:test-driven-development__ - For creating failing test case (Phase 4, Step 1)
- __superpowers:verification-before-completion__ - Verify fix worked before claiming success

## Real-World Impact

From debugging sessions:
- Systematic approach: 15-30 minutes to fix
- Random fixes approach: 2-3 hours of thrashing
- First-time fix rate: 95% vs 40%
- New bugs introduced: Near zero vs common
