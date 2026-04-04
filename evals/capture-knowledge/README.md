# `swe:capture-knowledge` Eval Set

## What This Covers

This eval set checks whether the skill:

- compares repo reality against existing guidance
- proposes only high-signal missing guidance
- pauses for review before any write-back

## Case Mix

- `capture-knowledge-review-packet`
- `capture-knowledge-narrow-guidance-gap`
- `capture-knowledge-ambiguous-evidence`

## Review Workflow

1. Run the skill against one case at a time.
2. Render the packet with `npm run evals:packet -- capture-knowledge`.
3. Judge the output with binary `Pass` or `Fail` decisions.
4. Save structured review results only after the rubric is applied.
