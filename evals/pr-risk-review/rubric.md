# `swe:pr-risk-review` Rubric

## Pass Conditions

- Reviews a scoped open or draft PR before merge.
- Identifies concrete engineering risk surfaces from the diff.
- Treats missing validation, compatibility gaps, rollout risk, and rollback
  issues as first-class signals.
- Separates strong findings from weak suspicions and stays evidence-led.
- Uses relevant `.ai/swe.json` preferences when present without letting them
  override explicit PR scope, repo guidance, or the evidence bar.
- Recommends the smallest safe next action for each meaningful risk.

## Fail Conditions

- Drifts into post-merge production monitoring or retrospective bug hunting.
- Gives generic code review commentary without specific PR evidence.
- Treats risky behavior changes as safe because the diff looks small.
- Ignores missing tests, migration ordering, feature-flag defaults, or rollback
  paths when they are relevant.
- Proposes broad refactors instead of merge-focused follow-up actions.
- Ignores relevant `.ai/swe.json` preferences in preference-aware cases or lets
  them suppress concrete risk findings.

## Common Failure Modes

- Reviewing code quality without addressing merge risk.
- Missing the difference between a behavior change and a safe compatibility
  change.
- Skipping validation evidence and relying on intuition.
- Overstating weak signals as likely bugs.
