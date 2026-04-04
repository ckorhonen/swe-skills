# Eval Framework Design

## Goal

Create a repo-native evaluation framework for the existing `swe:` skills that
supports:

- consistent scenario coverage per skill
- binary human review before any automated judging
- static validation of skill and eval asset structure
- a clean path to future code checks and validated LLM judges

## Why This Shape

This repository currently stores Markdown skill definitions plus lightweight
Node-based lint tooling. It does not yet have:

- trace storage
- labeled evaluation data
- an executable behavior harness
- a judge validation workflow

That makes a harness-first design the wrong first move. The framework should
start by making eval artifacts explicit, reviewable, and machine-checkable
without pretending the repo already has calibrated behavior scoring.

## Design Principles

### 1. Human Review Before Judges

Follow the eval guidance:

- use binary pass/fail review
- define failure modes concretely
- avoid holistic quality scores
- do not introduce LLM judges before there is labeled data to validate them

### 2. Separate Static Quality From Behavioral Quality

The repo needs two different eval layers:

- `static authoring checks`: validate skill frontmatter, required sections, and
  eval asset presence
- `scenario behavior evals`: define realistic user requests, required evidence,
  and binary review questions

### 3. Match Existing Repo Conventions

The framework should fit the current repository instead of importing a large
test harness:

- keep eval assets in `evals/`
- use JSON for machine-readable case definitions
- use Markdown for human-readable rubrics and workflow docs
- keep scripts dependency-free when possible

## Proposed Structure

```text
docs/plans/
  2026-04-04-eval-framework-design.md
  2026-04-04-eval-framework.md

evals/
  README.md
  shared/
    case.schema.json
    review-result.schema.json
    criteria.json
  capture-knowledge/
    README.md
    rubric.md
    cases.json
  merged-pr-monitoring/
    README.md
    rubric.md
    cases.json
  recent-commit-bug-hunt/
    README.md
    rubric.md
    cases.json
  refactor-opportunities/
    README.md
    rubric.md
    cases.json
  repo-introspection/
    README.md
    rubric.md
    cases.json
  security-audit/
    README.md
    rubric.md
    cases.json

scripts/
  validate-evals.mjs
  render-review-packet.mjs
```

## Artifact Roles

### `evals/shared/criteria.json`

Defines the shared binary review criteria that apply across multiple skills.
Examples:

- scope discipline
- concrete evidence
- honesty about unknowns
- actionable next steps
- instruction adherence
- output-shape compliance

### `evals/shared/case.schema.json`

Documents the expected structure of per-skill `cases.json` files so the repo has
an explicit contract for future additions.

### `evals/shared/review-result.schema.json`

Documents how future human or automated review outputs should be stored once the
team starts collecting labeled results.

### `evals/<skill>/rubric.md`

Defines the skill-specific binary criteria and the failure modes reviewers
should watch for.

### `evals/<skill>/cases.json`

Provides machine-readable evaluation scenarios. Each case should include:

- a stable case ID
- the target `swe:` skill name
- a realistic user request
- relevant context notes
- required artifacts to inspect
- shared criteria IDs
- explicit review questions

### `evals/<skill>/README.md`

Explains what the eval set is trying to verify and how to use the rubric and
cases together.

## Workflow

### V1 Review Loop

1. Update a skill in `skills/<slug>/SKILL.md`.
2. Update its eval assets in `evals/<slug>/`.
3. Run `npm run evals:check`.
4. Execute the skill manually against one or more cases.
5. Run `npm run evals:packet -- <skill-slug>`.
6. Review the produced output against the packet using binary pass/fail
   decisions and notes.
7. Save structured review results later using the shared result schema.

### Deferred Phase 2

Once enough reviewed examples exist:

1. run error analysis over the reviewed outputs
2. identify the highest-value recurring failure modes
3. implement code checks for objective failures
4. add one narrow judge per subjective failure mode
5. validate every judge with TPR/TNR before trusting it in CI

## Coverage Plan

Start with three cases per skill:

- one clear happy path
- one ambiguity or scope-control case
- one edge case or anti-pattern case

This yields 18 starter cases across the six current skills, which is enough to
exercise the framework without inventing a large benchmark corpus.

## Validation Plan

The repo should validate the framework with the narrowest useful checks:

- `npm run evals:check`
- `npm run lint:md`
- targeted packet generation for at least one skill

No model scoring or CI gate should claim behavioral quality yet. The first
version only guarantees that the eval assets are complete, consistent, and
review-ready.
