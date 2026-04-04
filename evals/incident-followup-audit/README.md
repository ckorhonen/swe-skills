# `swe:incident-followup-audit` Eval Set

## What This Covers

This eval set checks whether the skill:

- stays anchored to a specific incident or sev
- audits the engineering follow-up loop instead of doing root-cause analysis
- distinguishes done, partial, missing, and unknown follow-up evidence
- leaves a small, actionable backlog for remaining incident follow-through

## Case Mix

- `incident-followup-audit-complete-loop`
- `incident-followup-audit-partial-evidence`
- `incident-followup-audit-overbroad-root-cause-request`

## Review Workflow

1. Run the skill against one incident-scoped case.
2. Render the packet with `npm run evals:packet -- incident-followup-audit`.
3. Review the response with binary pass/fail decisions.
4. Save structured review results if the output will be reused later.
