# Creation Log: Systematic Debugging Skill

Reference example of extracting, structuring, and bulletproofing a critical skill.

## Source Material

Extracted debugging framework from `~/.claude/CLAUDE.md`:
- 4-phase systematic process (Investigation → Pattern Analysis → Hypothesis → Implementation)
- Core mandate: ALWAYS find root cause, NEVER fix symptoms
- Rules designed to resist time pressure and rationalization

## Extraction Decisions

__What to include:__
- Complete 4-phase framework with all rules
- Anti-shortcuts ("NEVER fix symptom", "STOP and re-analyze")
- Pressure-resistant language ("even if faster", "even if I seem in a hurry")
- Concrete steps for each phase

__What to leave out:__
- Project-specific context
- Repetitive variations of same rule
- Narrative explanations (condensed to principles)

## Structure Following skill-creation/SKILL.md

1. __Rich when_to_use__ - Included symptoms and anti-patterns
2. __Type: technique__ - Concrete process with steps
3. __Keywords__ - "root cause", "symptom", "workaround", "debugging", "investigation"
4. __Flowchart__ - Decision point for "fix failed" → re-analyze vs add more fixes
5. __Phase-by-phase breakdown__ - Scannable checklist format
6. __Anti-patterns section__ - What NOT to do (critical for this skill)

## Bulletproofing Elements

Framework designed to resist rationalization under pressure:

### Language Choices
- "ALWAYS" / "NEVER" (not "should" / "try to")
- "even if faster" / "even if I seem in a hurry"
- "STOP and re-analyze" (explicit pause)
- "Don't skip past" (catches the actual behavior)

### Structural Defenses
- __Phase 1 required__ - Can't skip to implementation
- __Single hypothesis rule__ - Forces thinking, prevents shotgun fixes
- __Explicit failure mode__ - "IF your first fix doesn't work" with mandatory action
- __Anti-patterns section__ - Shows exactly what shortcuts look like

### Redundancy
- Root cause mandate in overview + when_to_use + Phase 1 + implementation rules
- "NEVER fix symptom" appears 4 times in different contexts
- Each phase has explicit "don't skip" guidance

## Testing Approach

Created 4 validation tests following skills/meta/testing-skills-with-subagents:

### Test 1: Academic Context (No Pressure)
- Simple bug, no time pressure
- __Result:__ Perfect compliance, complete investigation

### Test 2: Time Pressure + Obvious Quick Fix
- User "in a hurry", symptom fix looks easy
- __Result:__ Resisted shortcut, followed full process, found real root cause

### Test 3: Complex System + Uncertainty
- Multi-layer failure, unclear if can find root cause
- __Result:__ Systematic investigation, traced through all layers, found source

### Test 4: Failed First Fix
- Hypothesis doesn't work, temptation to add more fixes
- __Result:__ Stopped, re-analyzed, formed new hypothesis (no shotgun)

__All tests passed.__ No rationalizations found.

## Iterations

### Initial Version
- Complete 4-phase framework
- Anti-patterns section
- Flowchart for "fix failed" decision

### Enhancement 1: TDD Reference
- Added link to skills/testing/test-driven-development
- Note explaining TDD's "simplest code" ≠ debugging's "root cause"
- Prevents confusion between methodologies

## Final Outcome

Bulletproof skill that:
- ✅ Clearly mandates root cause investigation
- ✅ Resists time pressure rationalization
- ✅ Provides concrete steps for each phase
- ✅ Shows anti-patterns explicitly
- ✅ Tested under multiple pressure scenarios
- ✅ Clarifies relationship to TDD
- ✅ Ready for use

## Key Insight

__Most important bulletproofing:__ Anti-patterns section showing exact shortcuts that feel justified in the moment. When Claude thinks "I'll just add this one quick fix", seeing that exact pattern listed as wrong creates cognitive friction.

## Usage Example

When encountering a bug:
1. Load skill: skills/debugging/systematic-debugging
2. Read overview (10 sec) - reminded of mandate
3. Follow Phase 1 checklist - forced investigation
4. If tempted to skip - see anti-pattern, stop
5. Complete all phases - root cause found

__Time investment:__ 5-10 minutes
__Time saved:__ Hours of symptom-whack-a-mole

---

*Created: 2025-10-03*
*Purpose: Reference example for skill extraction and bulletproofing*
