---
name: "swe:change-validation-planner"
description: >-
  Plans the narrowest trustworthy validation path for a scoped code change or
  diff. Use when a user asks what to run before merging, how to validate a
  specific change, whether the current checks are enough, or wants a bounded
  command order from narrow to broad. Do NOT use for writing tests, fixing the
  code change itself, broad QA sweeps, or generic debugging that needs root
  cause analysis.
compatibility: >-
  Requires a local checkout and works best when the changed files, diff, or PR
  scope are available. Strongest when repo-native test scripts, build commands,
  typecheck steps, and CI configuration can be inspected directly.
metadata:
  short-description: Plan the narrowest trustworthy validation path
---

# SWE Change Validation Planner

## What This Skill Does

Use this skill to turn a scoped code change into a disciplined validation plan.

The job is not to debug the change or rewrite tests. The job is to decide:

- what evidence is already enough
- what to validate first
- what to validate only if the earlier checks fail or remain ambiguous
- what remains unverified even after the recommended checks

The result should help an engineer or agent validate a change without wasting
time on broad, low-signal commands.

## When To Use

Use this skill when the user wants to:

- know what to run before merging a scoped change
- validate a diff, PR, or local edit with the smallest trustworthy command set
- compare narrow versus broad validation options
- understand what a change still does not prove
- plan a repeatable validation sequence for a specific repository surface

## Do Not Use

Do not use this skill for:

- implementing the code change itself
- writing or expanding tests as the primary task
- generic QA across the whole repo with no scoped change
- root-cause debugging when the failure cause is still unknown
- architecture planning or release orchestration

## Inputs To Confirm

Confirm or infer:

- the exact change scope, diff, or PR
- which files, packages, or services are touched
- what commands already exist in the repo
- whether the user wants a quick plan or a deeper validation ladder
- any flaky suites, slow commands, or no-touch areas
- whether CI signals are available for the changed surface

If the scope is missing, ask for the smallest additional detail needed to bound
the validation plan.

## Optional Local Preference Layer

If `.ai/swe.json` exists and the current request or repo guidance does not
override it, this skill may consult only these keys:

- `plan`
- `verify`
- `report`
- `alts`
- `paths`

Use them only to refine defaults:

- `plan` can change how much detail to include in the validation ladder
- `verify` can change how quickly the plan broadens after narrow checks
- `report` can change concision, but not the required report sections
- `alts` can control whether alternate ladders are surfaced when tradeoffs are
  material
- `paths` can raise caution for sensitive paths without expanding scope

Apply preferences in this order:

1. explicit user request
2. repo guidance such as `AGENTS.md` or `README.md`
3. `.ai/swe.json`
4. this skill's defaults

Do not let `.ai/swe.json` remove required sections, lower the evidence bar, or
replace missing scope information that must still be clarified.

## Tooling Stance

This skill is tool agnostic.

Prefer the repository's own validation entry points first, such as:

- targeted tests for the touched module or package
- lint or typecheck commands that cover the affected surface
- build or compile checks when the change crosses a boundary
- integration or e2e checks only when the change reaches those seams

Do not jump directly to the slowest or broadest suite unless the change is
actually system-wide or earlier checks are not meaningful.

## Instructions

### Step 1: Identify The Change Surface

Map the change to the smallest credible validation surface.

Inspect:

- changed files
- package or service boundaries
- affected entry points
- direct dependencies and callers

Keep the surface concrete. If a change touches one package and one contract,
validate that surface first.

### Step 2: Detect Existing Validation Paths

Inspect the repo for validation commands that already exist.

Look for:

- package scripts
- CI workflow commands
- test directories and naming conventions
- typecheck, lint, build, and smoke-test steps
- any repo-specific validation docs

Reuse local conventions instead of inventing a new command sequence.

### Step 3: Order Commands From Narrow To Broad

Produce a ranked sequence of commands or checks.

A strong sequence usually starts with:

1. the narrowest targeted test or check
2. a surface-level static check such as lint or typecheck
3. a build or compile step if the change crosses a boundary
4. a broader integration or suite-level check only if needed

Explain why each step earns its place and what it reduces uncertainty about.

### Step 4: Stop At The First Useful Confidence Boundary

Do not recommend unnecessary validation once the change is reasonably
established.

If a narrow check is enough for the requested confidence level, say so and stop.
If the narrow check is weak or inconclusive, broaden one step at a time instead
of jumping to the whole suite.

### Step 5: Track What Remains Unverified

Call out the residual risk explicitly.

For each plan, note:

- what the recommended commands will verify
- what they will not verify
- which assumptions remain open
- whether broader validation is still warranted

Do not present a validation plan as full proof when it is only partial evidence.

### Step 6: Prefer Incremental Plans For Wider Changes

If the diff spans multiple packages or boundaries, divide the plan into the
smallest trustworthy batches.

Group checks by disjoint surfaces when possible, but keep the final decision
centralized so the user can see the full confidence picture.

### Step 7: Avoid Cross-Contamination With Other Skills

Stay out of:

- bug diagnosis
- test authoring
- refactor suggestions
- production incident analysis

The output should only answer how to validate the requested change.

## Output Requirements

Provide a validation plan with these sections:

1. Scope reviewed
2. Validation ladder
3. What each step proves
4. What remains unverified
5. Recommended stopping point

For each planned check, include:

- command or check name
- why it is ordered there
- what signal would make it pass or fail
- whether it is narrow, medium, or broad

If the repo lacks a trustworthy validation path, say that plainly and explain
what evidence is missing.

## Quality Bar

- Keep the plan bounded to the actual change surface.
- Prefer repo-native commands and local conventions.
- Order checks from narrow to broad.
- Be explicit about residual risk and unknowns.
- Use `.ai/swe.json` only as an optional local default layer for relevant keys.
- Do not turn the skill into a generic test-writing or debugging assistant.
- Make the plan usable immediately by an engineer or agent.
