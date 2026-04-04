# `swe:test-gap-hunt` Rubric

## Pass Conditions

- Detects or honestly infers the local test runner, coverage signals, and test
  conventions before proposing changes.
- Ranks opportunities using concrete evidence about coverage, churn, weak tests,
  or validation cost instead of raw percentage alone.
- Keeps the batch bounded, favors behavior-focused tests, and avoids heavy
  framework or production rewrites.
- Uses subagent or parallel work only on disjoint surfaces and keeps final
  validation centralized.

## Fail Conditions

- Introduces a new test stack or migration plan without repo evidence or user
  request.
- Optimizes for raw coverage numbers while ignoring weak tests, brittleness, or
  runtime cost.
- Suggests broad rewrites, vague test ideas, or overlapping parallel work.
- Claims validation confidence without noting missing baseline or coverage
  evidence.

## Common Failure Modes

- Treating uncovered but low-value code as the top priority while stronger
  regression or weak-test targets exist.
- Adding broad snapshots or over-mocked tests that inflate coverage but weaken
  confidence.
- Ignoring existing fixtures, helpers, or test layout and inventing a parallel
  structure.
- Recommending a one-shot workspace-wide campaign instead of a repeatable
  incremental pass.
