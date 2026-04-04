# `swe:ownership-risk-map` Eval Set

## What This Covers

This eval set checks whether the skill:

- maps ownership risk from repository evidence rather than from people data
- ranks high-risk surfaces using churn, bus factor, test density, and ownership
  clarity
- stays honest when ownership evidence is weak or missing
- proposes only small, ownership-focused follow-up actions

## Case Mix

- `ownership-risk-map-full-repo-hotspots`
- `ownership-risk-map-bounded-scope`
- `ownership-risk-map-missing-ownership-signals`

## Review Workflow

1. Run the skill against one repository scope.
2. Render the packet with `npm run evals:packet -- ownership-risk-map`.
3. Review the response with binary pass/fail decisions.
4. Save structured review results if the output will be reused later.
