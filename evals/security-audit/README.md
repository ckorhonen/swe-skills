# `swe:security-audit` Eval Set

## What This Covers

This eval set checks whether the skill:

- audits package or service surfaces with concrete scanner evidence
- chooses the strongest available checks for the ecosystem in scope
- reports gaps and limitations instead of inventing coverage

## Case Mix

- `security-audit-full-package-surface`
- `security-audit-selected-scope`
- `security-audit-tooling-gap`

## Review Workflow

1. Run the skill against one audit scope.
2. Render the packet with `npm run evals:packet -- security-audit`.
3. Apply binary pass/fail review using the rubric.
4. Save structured review results once the report is finalized.
