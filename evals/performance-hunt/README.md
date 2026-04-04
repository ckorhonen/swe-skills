# `swe:performance-hunt` Eval Set

## What This Covers

This eval set checks whether the skill:

- finds measured or well-supported performance bottlenecks using scoped
  evidence
- stays focused on the requested performance surface and metric
- distinguishes strong bottlenecks from weak suspicion
- proposes the smallest practical experiments or fixes instead of broad rewrites
- labels missing runtime evidence and unknowns honestly

## Case Mix

- `performance-hunt-measured-bottleneck-review`
- `performance-hunt-report-only-no-runtime-data`
- `performance-hunt-bounded-first-pass`

## Review Workflow

1. Run the skill against one scoped repository surface.
2. Render the packet with `npm run evals:packet -- performance-hunt`.
3. Review the response with binary pass/fail decisions.
4. Save structured review results if the output will be reused later.
