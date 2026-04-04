# `swe:merged-pr-monitoring` Eval Set

## What This Covers

This eval set checks whether the skill:

- ties production claims to a scoped merged PR set
- confirms deployment before talking about production impact
- correlates cautiously when metrics are noisy or conflicting

## Case Mix

- `merged-pr-monitoring-confirmed-deploy`
- `merged-pr-monitoring-unconfirmed-deploy`
- `merged-pr-monitoring-conflicting-signals`

## Review Workflow

1. Run the skill against one case with the listed artifacts.
2. Render the packet with `npm run evals:packet -- merged-pr-monitoring`.
3. Apply binary pass/fail decisions against the rubric.
4. Save structured review results only after the report is reviewed.
