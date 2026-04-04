---
id: evidence-grounding
status: draft
validated: false
criterion: concrete-evidence
---

# Evidence Grounding Judge

## Failure Mode

This judge evaluates whether important claims in a candidate output are grounded
in the visible evidence provided with the task.

## Inputs

- candidate output
- visible evidence or artifacts
- optional task context

## Pass Definition

PASS when the important claims are tied to the visible evidence and any
inferences are labeled as such.

## Fail Definition

FAIL when the output:

- makes important claims without evidence
- states guesses as facts
- ignores contradictory evidence in the provided artifacts

## Few-Shot Example Plan

This prompt is still draft-only. Replace this section with real training-split
examples after human labels exist.

- one clear Pass grounded in named files, commands, or metrics
- one clear Fail that invents unsupported facts
- one borderline case with partially grounded reasoning and explicit inference
  labeling

## Structured Output

Use the schema in `judges/shared/judge-result.schema.json`.

```json
{
  "critique": "Explain whether the important claims are grounded in the provided evidence.",
  "result": "Pass or Fail"
}
```

## Draft Prompt

```text
You are an evaluator checking one thing only: whether the candidate output
grounds its important claims in the visible evidence.

PASS: Important claims are supported by the provided evidence, and any
inferences are labeled clearly.

FAIL: Important claims lack support, conflict with the evidence, or present
guesses as facts.

Return JSON with:
- critique: a specific explanation grounded in the candidate output and
  evidence
- result: Pass or Fail

Visible evidence:
{{evidence}}

Optional task context:
{{task_context}}

Candidate output:
{{candidate_output}}
```

## Validation Status

This judge is draft-only and must be validated against human labels before it
is used for scoring.
