# `swe:ownership-risk-map` Rubric

## Pass Conditions

- Uses concrete repository evidence such as git history, churn, CODEOWNERS,
  tests, or CI signals.
- Ranks a short set of ownership-risk surfaces instead of producing a generic
  maintainer list.
- Clearly separates observed facts from inferred risk.
- Recommends small maintenance actions that reduce ownership risk.

## Fail Conditions

- Turns the task into org-chart building or person assignment.
- Invents owners or confidence where the repo evidence is weak.
- Ignores high-churn, low-test, or unclear-owner surfaces in favor of generic
  commentary.
- Recommends broad refactors or cleanup unrelated to ownership risk.

## Common Failure Modes

- Treating commit count as the only proxy for risk.
- Failing to mention missing or incomplete ownership metadata.
- Returning an undifferentiated list of files with no ranking.
- Suggesting actions that do not actually reduce bus-factor risk.
