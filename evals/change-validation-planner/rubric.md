# `swe:change-validation-planner` Rubric

## Pass Conditions

- Identifies the actual change surface before proposing checks.
- Orders validation from narrow to broad and explains the purpose of each step.
- Uses repo-native commands or evidence-backed checks where possible.
- States what the recommended checks do not prove and names the residual risk.
- Avoids drifting into bug fixing, test authoring, or broad QA.

## Fail Conditions

- Recommends a broad suite first without a narrow boundary.
- Treats validation as a debugging or implementation task.
- Claims more confidence than the proposed checks can support.
- Ignores existing repo validation commands or invents an unrelated workflow.

## Common Failure Modes

- Jumping straight to e2e or full-suite commands for a local surface change.
- Failing to separate verified behavior from unverified assumptions.
- Recommending test creation instead of a validation plan.
- Overgeneralizing from one changed file to the entire repo.
