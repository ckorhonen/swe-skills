# `swe:test-gap-hunt` Eval Set

## What This Covers

This eval set checks whether the skill:

- detects and reuses the repository's existing test ecosystem
- prioritizes high-value test gaps and weak tests instead of chasing raw
  coverage numbers
- keeps each improvement pass incremental, performance-aware, and safe to run
  repeatedly

## Case Mix

- `test-gap-hunt-coverage-and-weak-tests`
- `test-gap-hunt-no-coverage-report`
- `test-gap-hunt-scheduled-incremental-pass`

## Review Workflow

1. Run the skill against one repository scope.
2. Render the packet with `npm run evals:packet -- test-gap-hunt`.
3. Review the response with binary pass/fail decisions.
4. Save structured review results if the output will be reused later.
