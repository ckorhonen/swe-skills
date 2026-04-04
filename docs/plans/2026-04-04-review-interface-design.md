# Review Interface And Judge Design

## Goal

Add a zero-dependency local review workflow for the `swe:` eval framework that:

- loads review items in the browser
- records binary Pass/Fail/Defer decisions plus notes
- saves results to local JSON files
- seeds the repo with draft judge prompts for subjective criteria
- creates a clean handoff to later evaluator validation

## Why This Is The Right Next Step

The repo now has:

- per-skill eval cases and rubrics
- shared review criteria
- validation for eval asset shape
- review-packet rendering

What it does not yet have:

- a browser workflow for reviewing outputs
- a local persistence mechanism for labels
- a labeled dataset for calibrating judges
- any judge prompt assets at all

That means the right order is:

1. build the review interface
2. collect labels
3. refine and validate judges later

It does **not** make sense to ship judges first and pretend they are calibrated.

## Architecture

### 1. Zero-Dependency Review App

Use plain HTML, CSS, and browser JavaScript under `review-app/`, served by a
tiny Node HTTP server in `scripts/`.

Proposed files:

```text
review-app/
  index.html
  app.js
  styles.css

scripts/
  review-server.mjs
  build-review-dataset.mjs
  validate-judges.mjs
```

No frontend framework and no runtime package dependency are needed.

### 2. Dataset Flow

The app should review JSON datasets, not raw `cases.json` directly.

Input datasets live under:

```text
review-data/datasets/
```

Saved labels live under:

```text
review-data/results/
```

This keeps the app generic and lets future review runs include:

- raw scenario-only review items
- model outputs mapped to eval cases
- judge disagreement sets

### 3. Review Item Shape

Each review item should contain enough information to review one trace or one
candidate output cleanly:

- item ID
- skill
- case ID
- title
- user request
- context notes
- artifact requirements
- shared criteria
- review questions
- candidate output
- optional supporting artifacts

The candidate output can be:

- a real model output later
- a synthetic seed output now, for smoke-testing and early rubric review

### 4. Local Persistence

The Node server should expose small JSON endpoints:

- list datasets
- load one dataset
- load saved results for one dataset
- save results for one dataset

Saving should be automatic after every label or note update.

### 5. Judge Prompt Strategy

Add draft judge prompts under `judges/`.

Do **not** pretend they are validated. Mark them explicitly as `draft`.

Start with a few cross-skill subjective judges:

- `scope-discipline`
- `evidence-grounding`
- `actionability`

Keep objective checks in code:

- schema presence
- required report sections
- file or command references
- output field shape

## Synthetic Seed Data

Use the current eval cases to bootstrap review items. Add a small deterministic
seed dataset that includes:

- one synthetic likely-pass candidate output
- one synthetic likely-fail candidate output

per selected case.

This is only to:

- smoke-test the review app
- help reviewers exercise the rubric
- seed future label collection

It is **not** a substitute for real labeled model outputs.

## UX Requirements

The interface should support:

- one-item-at-a-time review
- Pass / Fail / Defer controls
- notes
- progress counts
- next / previous navigation
- jump-to-ID
- keyboard shortcuts
- collapsible secondary details

Important rendering choices:

- highlight the candidate output as the primary judgment surface
- render context and review questions in side panels or secondary sections
- collapse verbose supporting artifacts by default

## Validation Plan

### Must Pass

- `npm run evals:check`
- `npm run judges:check`
- `npm run review:build-dataset`
- `npm run lint:md`

### Smoke Tests

- start the local review server
- request the dataset list endpoint
- request one dataset endpoint
- save a synthetic review result JSON
- open the review page locally in a browser

## Deferred Work

These should **not** be claimed as complete in this pass:

- judge calibration against human labels
- train/dev/test splitting for real review data
- TPR/TNR measurement
- bias correction on production estimates

Those belong to the later `validate-evaluator` phase after enough labels exist.
