# `swe:change-validation-planner` Rubric

## Pass Conditions

- Identifies the actual change surface before proposing checks.
- Orders validation from narrow to broad and explains the purpose of each step.
- Uses repo-native commands or evidence-backed checks where possible.
- States what the recommended checks do not prove and names the residual risk.
- Uses relevant `.ai/swe.json` preferences when present without letting them
  override explicit scope, repo guidance, or required output sections.
- Avoids drifting into bug fixing, test authoring, or broad QA.

## Fail Conditions

- Recommends a broad suite first without a narrow boundary.
- Treats validation as a debugging or implementation task.
- Claims more confidence than the proposed checks can support.
- Ignores existing repo validation commands or invents an unrelated workflow.
- Ignores relevant `.ai/swe.json` preferences in preference-aware cases or lets
  them override stronger instructions.

## Common Failure Modes

- Jumping straight to e2e or full-suite commands for a local surface change.
- Failing to separate verified behavior from unverified assumptions.
- Recommending test creation instead of a validation plan.
- Overgeneralizing from one changed file to the entire repo.
