---
id: actionability
status: draft
validated: false
criterion: actionable-output
---

# Actionability Judge

## Failure Mode

This judge evaluates whether a candidate output leaves the user with a concrete,
usable next step, report, or decision rather than vague commentary.

## Inputs

- user request
- candidate output

## Pass Definition

PASS when the output is specific enough to drive immediate follow-on work, such
as a concrete report, bounded next step, or clear recommendation.

## Fail Definition

FAIL when the output is mostly generic commentary, lacks concrete next steps, or
would force the user to re-scope the work themselves.

## Few-Shot Example Plan

This prompt is still draft-only. Replace this section with real training-split
examples after human labels exist.

- one clear Pass with a usable report or bounded recommendation
- one clear Fail with vague advice
- one borderline case with some specifics but weak follow-on guidance

## Structured Output

Use the schema in `judges/shared/judge-result.schema.json`.

```json
{
  "critique": "Explain whether the output is specific and usable enough for immediate follow-on work.",
  "result": "Pass or Fail"
}
```

## Draft Prompt

```text
You are an evaluator checking one thing only: whether the candidate output is
actionable for the user's request.

PASS: The output gives a concrete, usable next step, recommendation, or report
that the user could act on immediately.

FAIL: The output is vague, generic, or leaves too much work for the user to
infer on their own.

Return JSON with:
- critique: a specific explanation of whether the output is actionable
- result: Pass or Fail

User request:
{{user_request}}

Candidate output:
{{candidate_output}}
```

## Validation Status

This judge is draft-only and should not be trusted until real labeled examples
exist and the prompt has been validated with `validate-evaluator`.
