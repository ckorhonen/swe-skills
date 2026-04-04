# Review Interface And Judges Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a zero-dependency browser review workflow for the `swe:` eval
framework, add draft judge prompt assets, and create seed review datasets that
can be reviewed and saved locally.

**Architecture:** Use plain HTML/CSS/JS in `review-app/` plus tiny Node
scripts for serving static files, generating review datasets, validating judge
assets, and saving JSON review results. Keep all persistent state in local JSON
files under `review-data/`.

**Tech Stack:** HTML, CSS, browser JavaScript, Node.js built-ins, npm scripts

---

## Task 1: Add design documentation and review-data scaffolding

**Files:**

- Create: `docs/plans/2026-04-04-review-interface-design.md`
- Create: `docs/plans/2026-04-04-review-interface.md`
- Create: `review-data/datasets/.gitkeep`
- Create: `review-data/results/.gitkeep`

### Step 1: Save the design and implementation docs

Write the approved design and the task-by-task plan.

### Step 2: Add empty dataset and results directories

Create the directories that the review app will use for local JSON storage.

### Step 3: Run Markdown lint

Run: `npm run lint:md`

Expected: PASS

## Task 2: Implement the zero-dependency review app

**Files:**

- Create: `review-app/index.html`
- Create: `review-app/app.js`
- Create: `review-app/styles.css`

### Step 1: Build the static HTML shell

Include:

- dataset selector
- current item header
- Pass / Fail / Defer controls
- notes field
- next / previous controls
- jump-to-ID input
- progress counters
- review question panel
- supporting artifacts sections

### Step 2: Implement browser-side state management

Load datasets and results from the local server, support keyboard shortcuts, and
auto-save results after every change.

### Step 3: Implement readable rendering

Render:

- candidate output as the primary panel
- review questions as checklist-style prompts
- context notes and artifacts in collapsible sections
- criteria and rubric details in a secondary panel

## Task 3: Implement review dataset and server scripts

**Files:**

- Create: `scripts/review-server.mjs`
- Create: `scripts/build-review-dataset.mjs`
- Modify: `package.json`

### Step 1: Implement the local HTTP server

Add endpoints for:

- serving static review-app assets
- listing datasets
- loading one dataset JSON
- loading saved results for a dataset
- writing updated results JSON

### Step 2: Implement review dataset generation

Generate a combined review dataset from the existing eval cases and rubrics.

The first version should output:

- one all-skills dataset
- per-skill metadata
- synthetic candidate outputs for smoke-testing

### Step 3: Add npm scripts

Add:

- `review:build-dataset`
- `review:serve`

### Step 4: Run the dataset builder

Run: `npm run review:build-dataset`

Expected: PASS and one or more dataset files written under `review-data/datasets/`

## Task 4: Add draft judge prompt assets and validation

**Files:**

- Create: `judges/README.md`
- Create: `judges/shared/judge-result.schema.json`
- Create: `judges/scope-discipline.md`
- Create: `judges/evidence-grounding.md`
- Create: `judges/actionability.md`
- Create: `scripts/validate-judges.mjs`
- Modify: `package.json`
- Modify: `README.md`

### Step 1: Write draft judge prompts

Each prompt must:

- target one failure mode only
- define strict Pass / Fail criteria
- use structured JSON output
- be marked clearly as `draft` and `not validated`

### Step 2: Add a judge validator

Validate:

- required metadata fields
- draft status
- one-failure-mode framing
- structured output section presence

### Step 3: Add npm wiring and docs

Add:

- `judges:check`

Document the draft-only status and the later validation path.

## Task 5: Verify the workflow end to end

**Files:**

- No new files required

### Step 1: Run structural checks

Run:

- `npm run evals:check`
- `npm run judges:check`
- `npm run review:build-dataset`
- `npm run lint:md`

Expected: PASS

### Step 2: Start the local review server

Run: `npm run review:serve`

Expected: local server starts and prints a localhost URL

### Step 3: Smoke-test the server endpoints

Run narrow HTTP checks against:

- dataset list
- one dataset payload
- one save operation

Expected: PASS

### Step 4: Open the review page in a browser

Open the local URL in the system browser.

### Step 5: Report any deferred validation honestly

State clearly that judge calibration is still pending because no real labeled
train/dev/test split exists yet.
