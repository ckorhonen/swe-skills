# `swe:babysit-pr` Eval Set

## What This Covers

This eval set checks whether the skill:

- stays in a persistent one-PR watch loop instead of giving a one-shot review
- acknowledges and classifies new feedback correctly
- handles ambiguous and invalid review feedback without guessing
- investigates CI failures before reruns or fixes
- stops only when the PR is actually ready to merge or clearly blocked

## Case Mix

- `babysit-pr-happy-path`
- `babysit-pr-ambiguous-feedback`
- `babysit-pr-invalid-feedback`
- `babysit-pr-score-and-ci-loop`

## Review Workflow

1. Run the skill against one case with the listed artifacts.
2. Render the packet with `npm run evals:packet -- babysit-pr`.
3. Apply binary pass or fail decisions against the rubric.
4. Save structured review results only after the packet is reviewed.
