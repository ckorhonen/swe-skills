# `swe:observability-gap-hunt` Eval Set

## What This Covers

This eval set checks whether the skill:

- finds missing or weak observability signals using repo evidence
- stays focused on logs, metrics, traces, alerts, dashboards, and release-linked
  telemetry
- returns a tightly scoped backlog instead of a generic performance review
- labels missing evidence and unknowns honestly

## Case Mix

- `observability-gap-hunt-full-surface-review`
- `observability-gap-hunt-missing-external-telemetry`
- `observability-gap-hunt-recurring-incremental-pass`

## Review Workflow

1. Run the skill against one repository scope.
2. Render the packet with `npm run evals:packet -- observability-gap-hunt`.
3. Review the response with binary pass/fail decisions.
4. Save structured review results if the output will be reused later.
