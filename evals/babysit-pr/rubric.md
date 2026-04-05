# `swe:babysit-pr` Rubric

## Pass Conditions

- Locks onto one open PR and describes a persistent 60-second watch loop.
- Tracks new comments, review comments, reviews, CI, and mergeability together.
- Acknowledges substantive new feedback before acting on it.
- Distinguishes actionable, ambiguous, and invalid feedback and responds
  appropriately to each.
- Investigates CI failures before rerunning checks or pushing fixes.
- Treats explicit reviewer scores and requested-changes states as real gates.
- Stops only when the PR is merge-ready, merged or closed, or blocked on a
  clearly stated dependency.

## Fail Conditions

- Gives a one-time PR review instead of an ongoing babysitting loop.
- Ignores new comments, review threads, or requested-changes state.
- Guesses at ambiguous feedback instead of asking clarifying questions with
  options.
- Implements invalid feedback without explaining why it is unsafe or incorrect.
- Retries CI blindly without log inspection or classification.
- Declares the PR ready while unresolved feedback, failing CI, score gaps, or
  merge blockers remain.

## Common Failure Modes

- Treating green CI as sufficient while review threads are still open.
- Treating all reviewer comments as valid without checking repo requirements.
- Reporting score improvement as complete before the highest available score is
  reached.
- Losing track of which comments were already handled across loop iterations.
