# `swe:recent-commit-bug-hunt` Eval Set

## What This Covers

This eval set checks whether the skill:

- stays within the requested commit scope
- distinguishes strong evidence from weak suspicion
- proposes only minimal remediation sessions for real findings

## Case Mix

- `recent-commit-bug-hunt-last-24h`
- `recent-commit-bug-hunt-single-commit`
- `recent-commit-bug-hunt-overbroad-scope`

## Review Workflow

1. Run the skill against one scoped change set.
2. Render the packet with `npm run evals:packet -- recent-commit-bug-hunt`.
3. Judge the report with binary pass/fail decisions.
4. Save structured review results after the review is complete.
