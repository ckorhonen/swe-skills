# `swe:refactor-opportunities` Eval Set

## What This Covers

This eval set checks whether the skill:

- proposes small, low-risk, ticket-shaped refactors
- stays away from bug hunting and architecture rewrites
- keeps write boundaries and validation paths concrete

## Case Mix

- `refactor-opportunities-small-ticket-backlog`
- `refactor-opportunities-tailored-contributor`
- `refactor-opportunities-thin-surface`

## Review Workflow

1. Run the skill against one repository scope.
2. Render the packet with `npm run evals:packet -- refactor-opportunities`.
3. Review the proposed tickets with binary pass/fail decisions.
4. Save structured review results if the output will be reused later.
