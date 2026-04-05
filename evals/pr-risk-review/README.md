# `swe:pr-risk-review` Eval Set

## What This Covers

This eval set checks whether the skill:

- reviews open or draft PRs before merge rather than post-merge history
- identifies merge-risk surfaces such as missing validation, compatibility gaps,
  migrations, and feature-flag rollout issues
- separates strong findings from weak suspicions
- recommends the smallest safe next actions instead of broad refactors

## Case Mix

- `pr-risk-review-happy-path`
- `pr-risk-review-missing-validation`
- `pr-risk-review-rollout-gap`
- `pr-risk-review-preference-aware-sensitive-surface`

## Review Workflow

1. Run the skill against one PR-scoped case.
2. Render the packet with `npm run evals:packet -- pr-risk-review`.
3. Review the response with binary pass/fail decisions.
4. Save structured review results if the output will be reused later.
