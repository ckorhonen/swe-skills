---
name: "swe:test-gap-hunt"
description: >-
  Identifies and prioritizes the highest-value test coverage gaps in a
  repository or workspace, then incrementally adds or strengthens tests using
  the local test stack and cleanly scoped subagent work when available. Use
  when a user says `improve test coverage`, `find weak tests`, `add missing
  test cases`, `run a recurring test-improvement pass`, or asks for a
  language-agnostic workflow to strengthen mocks, fixtures, and test structure
  without chasing raw coverage numbers. Do NOT use for first-time framework
  selection, broad test-stack migrations, or large production refactors.
compatibility: >-
  Requires a local repository checkout and works best when the repository
  already has runnable tests, coverage artifacts, CI signals, or established
  test conventions that can be reused instead of replaced.
metadata:
  short-description: Incrementally close test gaps and strengthen weak tests
---

# SWE Test Gap Hunt

## What This Skill Does

Use this skill to run a bounded, evidence-led pass over a repository's tests.

The job is to:

- Detect the existing test and coverage workflow
- Rank the best test-improvement opportunities
- Add or strengthen a small number of high-value tests
- Improve weak test structure when it materially improves confidence or speed
- Leave a ranked backlog for the next incremental pass

This skill is language agnostic. Reuse the repository's own tooling, file
layout, and test conventions instead of forcing a new framework.

## When To Use

Use this skill when the user wants to:

- Improve coverage incrementally without broad rewrites
- Find the most important uncovered or weakly tested code paths
- Strengthen fragile, assertion-light, or over-mocked tests
- Add missing edge, error, branch, or boundary cases
- Run recurring or scheduled test-improvement passes over time

## Do Not Use

Do not use this skill for:

- First-time test framework selection or migration
- Large production refactors done in the name of testability
- Coverage-number campaigns with no quality bar
- Pure performance profiling that is unrelated to test speed or test structure
- Broad QA or bug hunting without a test-improvement goal

## Inputs To Confirm

Confirm or infer:

- Repository or package scope
- Whether the user wants execution or report-only output
- Runtime budget for validation and coverage commands
- Any no-touch areas or flaky suites to avoid
- Whether recent CI, coverage, or bug history is available

If the user does not specify a budget, default to a small incremental pass:

- rank the workspace
- improve the top 1-3 opportunities
- stop after targeted validation

## Parallelization Rule

Create one session per cleanly separated package, module, or service when the
environment supports parallel agent work.

- Run only on disjoint write surfaces
- Cap concurrency to a level the repo can validate safely
- Give each session a bounded target and explicit test files or directories
- Have each session return raw evidence, changed files, and validation output
- Keep prioritization, deduplication, and final validation in the parent
  session

If parallel sessions are unavailable, process the same opportunities in local
batches and keep the same output shape.

## Instructions

### Step 1: Detect The Existing Test Ecosystem

Inspect the repository before proposing changes.

Identify:

- Test runners and entry commands
- Coverage tools and report formats
- Existing test file layout and naming patterns
- Mock, fixture, factory, and helper conventions
- CI commands or package scripts already used for tests

Do not introduce a new framework unless the user explicitly asks for it.

## Tooling Stance

This skill is tool agnostic.

Use the strongest available local conventions for the detected ecosystem, such
as:

- `vitest`, `jest`, `mocha`, or `ava`
- `pytest`, `unittest`, or `nose`
- `go test`
- `cargo test`
- `rspec`, `minitest`, or `bundle exec rspec`
- coverage outputs such as `lcov`, `coverage.py`, `pytest-cov`, `nyc`, `gcov`,
  `jacoco`, or CI-native summaries

Prefer the repository's own scripts and CI commands over ad hoc commands.

### Step 2: Establish A Baseline

Run the narrowest useful existing commands to confirm the current state.

Capture:

- Whether the relevant baseline tests already pass
- Which coverage signals are available and trustworthy
- Which suites are flaky, missing, or too slow to rely on

If the baseline is already red for unrelated reasons, say so directly and avoid
claiming the skill completed a safe improvement pass.

### Step 3: Identify And Score Opportunities

Rank opportunities using concrete evidence, not raw coverage percentage alone.

Consider:

- Low or missing coverage on exposed, central, or high-churn code
- Recently changed code with little nearby test support
- Existing bug fixes with missing regression tests
- Weak tests that create false confidence
- Validation cost and expected runtime impact

### Step 4: Inspect Existing Tests For Weakness

Treat weak tests as real gaps even when line coverage is technically present.

Look for:

- Assertion-light tests
- Duplicated happy-path tests with no edge or error coverage
- Snapshot-only coverage of meaningful behavior
- Brittle global fixtures or hidden shared state
- Over-mocked tests that verify calls instead of outcomes
- Slow tests that could be replaced by cheaper coverage at a lower seam

If a test is weak but still the best local starting point, augment it instead
of creating duplicate coverage elsewhere.

### Step 5: Choose A Small Incremental Batch

Pick the smallest high-value set of opportunities that can be improved safely
in one pass.

Prefer:

- missing branch, error, boundary, and regression coverage
- augmenting existing test modules before creating many new ones
- improvements that reduce brittleness and runtime cost together
- helper, fixture, or factory cleanup only when it directly supports stronger
  tests

Avoid:

- padding coverage with trivial assertions
- huge fixture abstractions up front
- production changes unless a tiny testability seam is required

### Step 6: Add Or Strengthen Tests

When implementing tests:

- Prefer behavior-focused assertions over incidental implementation checks
- Use real collaborators when they are cheap and deterministic
- Use fakes, stubs, or mocks at external boundaries only where they reduce
  brittleness
- Keep fixtures explicit, local, and easy to read
- Optimize for fast repeatable validation, not maximum abstraction

If a tiny production seam is necessary, keep it minimal and explain why the
test could not be written cleanly without it.

### Step 7: Validate Narrow To Broad

Validate the touched surface with the narrowest useful commands first, then
expand only if the result strengthens confidence materially.

Prefer:

- targeted test files or directories
- touched-package coverage commands
- broader suite checks only when the local pass is green and the repo pattern
  makes it practical

Do not rerun the entire workspace unnecessarily.

### Step 8: Leave A Residual Backlog

At the end of the pass, leave the next ranked opportunities for the following
loop or scheduled run.

If the user asked for report-only output, stop after ranking and validation
planning.

## Output Requirements

Produce a report with these sections:

1. Scope reviewed
2. Detected test tooling and baseline
3. Ranked opportunities
4. Execution plan
5. Changes applied
6. Validation run
7. Remaining backlog

For each ranked opportunity, include:

- Area or surface
- Why it matters now
- Whether the gap is missing coverage, a weak test, or both
- Expected files or test modules to touch
- Validation strategy
- Priority: `high`, `medium`, or `low`

For each applied change, include:

- Files touched
- What test gap or weak-test issue was addressed
- Whether mocks, fixtures, or helpers were introduced or tightened
- Validation commands and outcomes

If no safe improvement should be made, say so directly and return only the
ranked backlog.

## Examples

### Example 1

User says: `Find the top test coverage gaps in this workspace and fix the best
two without making a huge mess.`

Actions:

1. Detect the repo's existing test and coverage commands
2. Rank the best opportunities using coverage and test-quality evidence
3. Improve the top two disjoint surfaces
4. Run targeted validation and leave the next backlog

Result: The user gets a small, validated batch of test improvements instead of
an unbounded coverage project.

### Example 2

User says: `Run a weekly pass that strengthens weak tests and adds missing edge
cases, but keep it fast.`

Actions:

1. Inspect the current test layout and identify weak tests
2. Pick a small batch that improves confidence without broad rewrites
3. Prefer local fixtures, narrow validation, and fast-running tests
4. Return the remaining backlog for the next scheduled pass

Result: The workflow behaves like an incremental maintenance loop rather than a
one-shot campaign.

## Troubleshooting

### Problem: Coverage Artifacts Are Missing Or Stale

Use the repository's existing test layout, recent changes, and CI signals to
rank opportunities, but say clearly that the ranking had weaker coverage
evidence.

### Problem: The Baseline Suite Is Already Failing

Call that out and avoid claiming the pass is fully validated. Limit work to
report-only mode or a tightly scoped area if the failures are clearly
unrelated.

### Problem: The Fastest Coverage Win Requires Heavy Mocking

Do not take the easy percentage win. Prefer a smaller, more behavior-focused
test or leave the item in the backlog.

## Quality Bar

- Be evidence-led and language agnostic
- Reuse the repository's local test conventions before inventing new ones
- Prioritize risk reduction and weak-test repair over raw coverage gain
- Keep each pass small enough to run repeatedly or on a schedule
- Use parallel sessions only on cleanly separated write surfaces
- Optimize for readable, maintainable, and fast-running tests
