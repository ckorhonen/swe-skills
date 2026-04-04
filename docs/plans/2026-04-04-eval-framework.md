# Eval Framework Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a repo-native eval framework for every current `swe:` skill with
starter cases, shared schemas, lightweight validation scripts, and README
documentation.

**Architecture:** Store human-readable eval guidance in Markdown and
machine-readable scenarios in JSON under `evals/`. Use small dependency-free
Node scripts to validate the asset graph and render review packets, keeping the
framework aligned with the repo's existing lightweight toolchain.

**Tech Stack:** Markdown, JSON, Node.js built-in modules, npm scripts

---

## Task 1: Create planning and eval scaffolding

**Files:**

- Create: `docs/plans/2026-04-04-eval-framework-design.md`
- Create: `docs/plans/2026-04-04-eval-framework.md`
- Create: `evals/README.md`
- Create: `evals/shared/case.schema.json`
- Create: `evals/shared/review-result.schema.json`
- Create: `evals/shared/criteria.json`

### Step 1: Write the files with the approved framework shape

Add the design doc, the implementation plan, and the shared eval framework
artifacts.

### Step 2: Run Markdown lint on the new docs

Run: `npm run lint:md`

Expected: PASS with no Markdown errors.

### Step 3: Commit

Skip unless the user explicitly asks for a commit.

## Task 2: Add per-skill eval assets

**Files:**

- Create: `evals/capture-knowledge/README.md`
- Create: `evals/capture-knowledge/rubric.md`
- Create: `evals/capture-knowledge/cases.json`
- Create: `evals/merged-pr-monitoring/README.md`
- Create: `evals/merged-pr-monitoring/rubric.md`
- Create: `evals/merged-pr-monitoring/cases.json`
- Create: `evals/recent-commit-bug-hunt/README.md`
- Create: `evals/recent-commit-bug-hunt/rubric.md`
- Create: `evals/recent-commit-bug-hunt/cases.json`
- Create: `evals/refactor-opportunities/README.md`
- Create: `evals/refactor-opportunities/rubric.md`
- Create: `evals/refactor-opportunities/cases.json`
- Create: `evals/repo-introspection/README.md`
- Create: `evals/repo-introspection/rubric.md`
- Create: `evals/repo-introspection/cases.json`
- Create: `evals/security-audit/README.md`
- Create: `evals/security-audit/rubric.md`
- Create: `evals/security-audit/cases.json`

### Step 1: Draft three starter cases per skill

Use one happy path, one scope-control case, and one edge or anti-pattern case
for each existing skill.

### Step 2: Write skill-specific rubrics

Define binary pass/fail review standards and concrete failure modes aligned with
each skill's instructions.

### Step 3: Add per-skill README guidance

Explain what the eval set checks and how to use the rubric plus cases together.

### Step 4: Run Markdown lint

Run: `npm run lint:md`

Expected: PASS with no Markdown errors.

## Task 3: Implement validation and packet rendering scripts

**Files:**

- Create: `scripts/validate-evals.mjs`
- Create: `scripts/render-review-packet.mjs`
- Modify: `package.json`

### Step 1: Write the failing command mentally by defining validation rules

The validator should fail if:

- a skill frontmatter name does not start with `swe:`
- required skill sections are missing
- a skill is missing its eval directory
- required eval files are missing
- a `cases.json` file is malformed or inconsistent

### Step 2: Implement the validator

Use only Node built-ins. Validate shared criteria IDs, case counts, skill name
alignment, required fields, and basic section presence.

### Step 3: Implement packet rendering

Support `npm run evals:packet -- <skill-slug>` and optionally `--out <path>`.
Render one Markdown packet containing the selected skill's description, rubric,
shared criteria, case definitions, and a review-result template.

### Step 4: Add npm scripts

Add:

- `evals:check`
- `evals:packet`

### Step 5: Run the validator

Run: `npm run evals:check`

Expected: PASS with a summary of validated skills and cases.

## Task 4: Update repo documentation

**Files:**

- Modify: `README.md`

### Step 1: Document the eval framework

Explain:

- the `evals/` directory layout
- how to validate eval assets
- how to render a review packet
- how to add eval coverage for new skills

### Step 2: Keep existing install and lint guidance accurate

Do not make `README.md` materially inaccurate relative to the repository.

### Step 3: Run Markdown lint

Run: `npm run lint:md`

Expected: PASS with no Markdown errors.

## Task 5: Verify the full v1 framework

**Files:**

- No new files expected

### Step 1: Run narrow validation

Run: `npm run evals:check`

Expected: PASS.

### Step 2: Render at least one packet

Run: `npm run evals:packet -- repo-introspection`

Expected: Markdown packet printed to stdout.

### Step 3: Re-run Markdown lint

Run: `npm run lint:md`

Expected: PASS.

### Step 4: Review the diff for scope discipline

Run: `git diff --stat`

Expected: Changes limited to planning docs, `evals/`, `scripts/`, `package.json`,
and `README.md`.

### Step 5: Commit

Skip unless the user explicitly asks for a commit.
