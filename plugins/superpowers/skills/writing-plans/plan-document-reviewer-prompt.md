# Plan Document Reviewer Prompt Template

Use this template when dispatching a plan document reviewer subagent.

__Purpose:__ Verify the plan is complete, matches the spec, and has proper task decomposition.

__Dispatch after:__ The complete plan is written.

```
Task tool (general-purpose):
  description: "Review plan document"
  prompt: |
    You are a plan document reviewer. Verify this plan is complete and ready for implementation.

    __Plan to review:__ [PLAN_FILE_PATH]
    __Spec for reference:__ [SPEC_FILE_PATH]

    ## What to Check

    | Category | What to Look For |
    |----------|------------------|
    | Completeness | TODOs, placeholders, incomplete tasks, missing steps |
    | Spec Alignment | Plan covers spec requirements, no major scope creep |
    | Task Decomposition | Tasks have clear boundaries, steps are actionable |
    | Buildability | Could an engineer follow this plan without getting stuck? |

    ## Calibration

    __Only flag issues that would cause real problems during implementation.__
    An implementer building the wrong thing or getting stuck is an issue.
    Minor wording, stylistic preferences, and "nice to have" suggestions are not.

    Approve unless there are serious gaps - missing requirements from the spec,
    contradictory steps, placeholder content, or tasks so vague they can't be acted on.

    ## Output Format

    ## Plan Review

    __Status:__ Approved | Issues Found

    __Issues (if any):__
    - [Task X, Step Y]: [specific issue] - [why it matters for implementation]

    __Recommendations (advisory, do not block approval):__
    - [suggestions for improvement]
```

__Reviewer returns:__ Status, Issues (if any), Recommendations
