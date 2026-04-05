# `swe:repo-introspection` Rubric

## Pass Conditions

- Grounds the orientation report in concrete files, directories, configs,
  commands, or commits.
- Covers structure, tooling, validation, and safe starting points when the case
  asks for them.
- Labels inferred boundaries or entry points instead of presenting them as
  direct facts.
- Uses relevant `.ai/swe.json` preferences when present without letting them
  override required sections or direct repo evidence.
- Produces a useful report for immediate follow-on engineering work.

## Fail Conditions

- Invents runtime architecture or entry points not visible in the repo.
- Gives a generic repo tour with little file-level grounding.
- Omits validation surfaces or safe starting areas in cases that ask for them.
- Treats uncertainty as certainty.
- Ignores relevant `.ai/swe.json` preferences in preference-aware cases or lets
  them hide important boundaries or evidence.

## Common Failure Modes

- Calling documentation guesses direct evidence.
- Claiming whole-repo coverage while only inspecting a narrow slice.
- Ignoring the difference between observed structure and inferred boundaries.
- Recommending risky edit areas without justification.
