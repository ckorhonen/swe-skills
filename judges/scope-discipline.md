---
id: scope-discipline
status: draft
validated: false
criterion: scope-discipline
---

# Scope Discipline Judge

## Failure Mode

This judge evaluates whether a skill output stays inside the user's requested
scope and the skill's explicit non-goals.

## Inputs

- user request
- relevant scope constraints or non-goals
- candidate output

## Pass Definition

PASS when the output answers the requested task without broadening into
unrequested implementation, unrelated analysis, or actions the skill says it
should not take.

## Fail Definition

FAIL when the output:

- broadens into adjacent work the user did not ask for
- ignores a clear scope boundary
- performs or recommends work that conflicts with an explicit non-goal

## Few-Shot Example Plan

This prompt is still draft-only. Replace this section with training-split
examples after human labels exist.

- include one clear Pass
- include one clear Fail
- include one borderline case where the answer is useful but starts drifting

## Structured Output

Use the schema in `judges/shared/judge-result.schema.json`.

```json
{
  "critique": "Explain exactly where the output stayed within scope or drifted beyond it.",
  "result": "Pass or Fail"
}
```

## Draft Prompt

```text
You are an evaluator checking one thing only: whether the candidate output
stayed within the user's requested scope.

Evaluate the candidate output using the following rule.

PASS: The output addresses the user's requested task while respecting explicit
scope boundaries and non-goals.

FAIL: The output expands beyond the requested task, ignores explicit
constraints, or performs or recommends work outside the allowed scope.

You must return JSON with:
- critique: a specific explanation grounded in the candidate output
- result: Pass or Fail

User request:
{{user_request}}

Scope constraints or non-goals:
{{scope_constraints}}

Candidate output:
{{candidate_output}}
```

## Validation Status

This judge is draft-only and must not be treated as calibrated until
human-labeled train/dev/test data exists and `validate-evaluator` has been run.
