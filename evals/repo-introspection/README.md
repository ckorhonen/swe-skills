# `swe:repo-introspection` Eval Set

## What This Covers

This eval set checks whether the skill:

- maps the repo with concrete evidence
- labels inferences instead of inventing hidden architecture
- identifies safe starting points for follow-on work

## Case Mix

- `repo-introspection-whole-repo-orientation`
- `repo-introspection-bounded-surface`
- `repo-introspection-inference-boundary`
- `repo-introspection-preference-aware-safe-start`

## Review Workflow

1. Run the skill against one case.
2. Render the packet with `npm run evals:packet -- repo-introspection`.
3. Apply binary pass/fail review against the rubric.
4. Save structured review results if the output should become labeled data.
