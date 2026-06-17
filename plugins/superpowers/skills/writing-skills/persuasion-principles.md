# Persuasion Principles for Skill Design

## Overview

LLMs respond to the same persuasion principles as humans. Understanding this psychology helps you design more effective skills - not to manipulate, but to ensure critical practices are followed even under pressure.

__Research foundation:__ Meincke et al. (2025) tested 7 persuasion principles with N=28,000 AI conversations. Persuasion techniques more than doubled compliance rates (33% → 72%, p < .001).

## The Seven Principles

### 1. Authority
__What it is:__ Deference to expertise, credentials, or official sources.

__How it works in skills:__
- Imperative language: "YOU MUST", "Never", "Always"
- Non-negotiable framing: "No exceptions"
- Eliminates decision fatigue and rationalization

__When to use:__
- Discipline-enforcing skills (TDD, verification requirements)
- Safety-critical practices
- Established best practices

__Example:__
```markdown
✅ Write code before test? Delete it. Start over. No exceptions.
❌ Consider writing tests first when feasible.
```

### 2. Commitment
__What it is:__ Consistency with prior actions, statements, or public declarations.

__How it works in skills:__
- Require announcements: "Announce skill usage"
- Force explicit choices: "Choose A, B, or C"
- Use tracking: TodoWrite for checklists

__When to use:__
- Ensuring skills are actually followed
- Multi-step processes
- Accountability mechanisms

__Example:__
```markdown
✅ When you find a skill, you MUST announce: "I'm using [Skill Name]"
❌ Consider letting your partner know which skill you're using.
```

### 3. Scarcity
__What it is:__ Urgency from time limits or limited availability.

__How it works in skills:__
- Time-bound requirements: "Before proceeding"
- Sequential dependencies: "Immediately after X"
- Prevents procrastination

__When to use:__
- Immediate verification requirements
- Time-sensitive workflows
- Preventing "I'll do it later"

__Example:__
```markdown
✅ After completing a task, IMMEDIATELY request code review before proceeding.
❌ You can review code when convenient.
```

### 4. Social Proof
__What it is:__ Conformity to what others do or what's considered normal.

__How it works in skills:__
- Universal patterns: "Every time", "Always"
- Failure modes: "X without Y = failure"
- Establishes norms

__When to use:__
- Documenting universal practices
- Warning about common failures
- Reinforcing standards

__Example:__
```markdown
✅ Checklists without TodoWrite tracking = steps get skipped. Every time.
❌ Some people find TodoWrite helpful for checklists.
```

### 5. Unity
__What it is:__ Shared identity, "we-ness", in-group belonging.

__How it works in skills:__
- Collaborative language: "our codebase", "we're colleagues"
- Shared goals: "we both want quality"

__When to use:__
- Collaborative workflows
- Establishing team culture
- Non-hierarchical practices

__Example:__
```markdown
✅ We're colleagues working together. I need your honest technical judgment.
❌ You should probably tell me if I'm wrong.
```

### 6. Reciprocity
__What it is:__ Obligation to return benefits received.

__How it works:__
- Use sparingly - can feel manipulative
- Rarely needed in skills

__When to avoid:__
- Almost always (other principles more effective)

### 7. Liking
__What it is:__ Preference for cooperating with those we like.

__How it works:__
- __DON'T USE for compliance__
- Conflicts with honest feedback culture
- Creates sycophancy

__When to avoid:__
- Always for discipline enforcement

## Principle Combinations by Skill Type

| Skill Type | Use | Avoid |
|------------|-----|-------|
| Discipline-enforcing | Authority + Commitment + Social Proof | Liking, Reciprocity |
| Guidance/technique | Moderate Authority + Unity | Heavy authority |
| Collaborative | Unity + Commitment | Authority, Liking |
| Reference | Clarity only | All persuasion |

## Why This Works: The Psychology

__Bright-line rules reduce rationalization:__
- "YOU MUST" removes decision fatigue
- Absolute language eliminates "is this an exception?" questions
- Explicit anti-rationalization counters close specific loopholes

__Implementation intentions create automatic behavior:__
- Clear triggers + required actions = automatic execution
- "When X, do Y" more effective than "generally do Y"
- Reduces cognitive load on compliance

__LLMs are parahuman:__
- Trained on human text containing these patterns
- Authority language precedes compliance in training data
- Commitment sequences (statement → action) frequently modeled
- Social proof patterns (everyone does X) establish norms

## Ethical Use

__Legitimate:__
- Ensuring critical practices are followed
- Creating effective documentation
- Preventing predictable failures

__Illegitimate:__
- Manipulating for personal gain
- Creating false urgency
- Guilt-based compliance

__The test:__ Would this technique serve the user's genuine interests if they fully understood it?

## Research Citations

__Cialdini, R. B. (2021).__ *Influence: The Psychology of Persuasion (New and Expanded).* Harper Business.
- Seven principles of persuasion
- Empirical foundation for influence research

__Meincke, L., Shapiro, D., Duckworth, A. L., Mollick, E., Mollick, L., & Cialdini, R. (2025).__ Call Me A Jerk: Persuading AI to Comply with Objectionable Requests. University of Pennsylvania.
- Tested 7 principles with N=28,000 LLM conversations
- Compliance increased 33% → 72% with persuasion techniques
- Authority, commitment, scarcity most effective
- Validates parahuman model of LLM behavior

## Quick Reference

When designing a skill, ask:

1. __What type is it?__ (Discipline vs. guidance vs. reference)
2. __What behavior am I trying to change?__
3. __Which principle(s) apply?__ (Usually authority + commitment for discipline)
4. __Am I combining too many?__ (Don't use all seven)
5. __Is this ethical?__ (Serves user's genuine interests?)
