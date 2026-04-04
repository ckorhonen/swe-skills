# `swe:docs-drift-audit` Eval Set

## What This Covers

This eval set checks whether the skill:

- identifies the code or workflow change surface first
- audits human-facing and operational docs for actual drift
- avoids agent-guidance updates and generic documentation rewrites
- produces a small, evidence-backed edit queue

## Case Mix

- `docs-drift-audit-recent-change-with-stale-readme`
- `docs-drift-audit-ops-docs-drift`
- `docs-drift-audit-no-confirmed-drift`

## Review Workflow

1. Run the skill against one repository scope.
2. Render the packet with `npm run evals:packet -- docs-drift-audit`.
3. Review the response with binary pass/fail decisions.
4. Save structured review results if the output will be reused later.
