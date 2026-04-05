# `swe:change-validation-planner` Eval Set

## What This Covers

This eval set checks whether the skill:

- starts from a scoped change surface before recommending checks
- orders validation from narrow to broad instead of jumping to the whole suite
- distinguishes what is verified from what remains unverified
- stays out of test-writing, debugging, and broad QA work

## Case Mix

- `change-validation-planner-small-surface-ladder`
- `change-validation-planner-cross-boundary-change`
- `change-validation-planner-missing-validation-path`
- `change-validation-planner-preference-aware-ladder`

## Review Workflow

1. Run the skill against one scoped change case.
2. Render the packet with `npm run evals:packet -- change-validation-planner`.
3. Review the validation plan with binary pass/fail decisions.
4. Save structured review results if the output will be reused later.
