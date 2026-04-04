# `swe:recent-commit-bug-hunt` Rubric

## Pass Conditions

- Names the exact commit or timeframe under review.
- Ties findings to concrete repo evidence such as diffs, files, CI, or tests.
- Separates strong or moderate findings from weak signals.
- Recommends only the smallest behavior-focused follow-up sessions.

## Fail Conditions

- Invents bugs with no commit-linked evidence.
- Turns weak suspicion into a fix plan.
- Broadens into generic code review or cleanup advice.
- Suggests refactors instead of minimal remediation sessions.

## Common Failure Modes

- Reporting old issues not clearly connected to the scoped commits.
- Forgetting to list the validation path for a proposed fix.
- Collapsing evidence strength into a single undifferentiated list.
- Overusing broad test runs unrelated to the changed surface.
