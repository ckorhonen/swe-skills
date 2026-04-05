---
name: "swe:repo-introspection"
description: >-
  Inspects an unfamiliar software repository and produces a concrete orientation
  report covering structure, tooling, entry points, boundaries, active
  surfaces, and safe places to start work. Use when a user says `help me
  understand this repo`, `map this codebase before I edit it`, `where should I
  start`, or asks for an engineering walkthrough before planning or delegation.
  Do NOT use when the user already knows the target change and wants
  implementation, or when they need a specific bug diagnosis rather than repo
  orientation.
compatibility: >-
  Requires a local checkout and shell access. Works best with standard repo
  inspection tools such as `fd`, `rg`, and `git`, plus access to repo docs or
  CI configuration.
metadata:
  short-description: Map a repo before changing it
---

# SWE Repo Introspection

## What This Skill Does

Use this skill to help an engineer or agent become productive in an unfamiliar
codebase without guessing.

The report should explain:

- How the repository is organized
- How it is likely operated
- Where the important boundaries are
- Which surfaces look safest to touch next

## When To Use

Use this skill when the user wants to:

- Understand an unfamiliar repository before editing it
- Prepare for delegation or planning
- Map tooling, entry points, and boundaries
- Find safe starting surfaces for follow-on work

## Do Not Use

Do not use this skill for:

- Implementing a known change request
- Debugging one specific defect
- Writing a broad architecture vision that goes beyond visible repo evidence

## Inputs To Confirm

Confirm or infer:

- Repo or package scope
- Whether the user wants a whole-repo view or only selected directories
- Whether recent activity or ownership context matters

## Optional Local Preference Layer

If `.ai/swe.json` exists and the current request or repo guidance does not
override it, this skill may consult only these keys:

- `report`
- `alts`
- `paths`

Use them only to refine defaults:

- `report` can change how concise or detailed each section is
- `alts` can control whether multiple safe entry points are surfaced
- `paths` can keep matching areas out of the default "safe starting points"
  list unless the user explicitly asks for them

Apply preferences in this order:

1. explicit user request
2. repo guidance such as `AGENTS.md` or `README.md`
3. `.ai/swe.json`
4. this skill's defaults

Do not let `.ai/swe.json` remove required sections, hide important boundaries,
or override direct repo evidence.

## What To Optimize For

- Concrete evidence from the repository
- Fast orientation
- Clear mental model of the codebase
- Accurate identification of entry points and working surfaces
- Explicit unknowns instead of speculation

## Instructions

### Step 1: Inspect The Root And Primary Docs

Start with the repo root, major directories, and the main documentation files.

### Step 2: Identify Tooling And Runtime Shape

Find the main languages, frameworks, package managers, and build or runtime
tooling.

### Step 3: Locate Entry Points And Boundaries

Find likely entry points such as:

- App starts
- Services
- CLI commands
- Routes
- Workers
- Jobs
- Library exports

Map the major code surfaces and their responsibilities.

### Step 4: Capture Validation And Automation Surfaces

Identify:

- Test locations
- Validation commands
- CI or automation surfaces
- Generated or machine-managed areas

### Step 5: Note Active And Safe Areas

Inspect recent commits when useful to understand active areas or likely
ownership.

Then summarize the safest and most relevant surfaces for follow-on work.

## Evidence Rules

- Ground the report in specific files, directories, configs, commands, or
  recent commits
- Use direct repo evidence whenever possible
- If something is inferred rather than directly observed, label it as an
  inference
- If key information is missing, say so plainly

## What To Look For

Focus on practical orientation details such as:

- Repository purpose
- Top-level directory responsibilities
- Main runtime entry points
- Build, test, lint, and typecheck commands
- Shared libraries or internal packages
- Configuration hubs
- Integration boundaries
- Generated code or machine-managed surfaces
- High-change or recently active areas
- Safe small-scope places to start editing

## Output Requirements

Provide a report with these sections:

1. Repository summary
2. Structure map
3. Tooling and validation
4. Entry points and boundaries
5. Active or important surfaces
6. Safe starting points
7. Unknowns or risks

For each major area you describe, include:

- Area or surface
- Relevant files or directories
- Responsibility
- Why it matters

For the `safe starting points` section, include:

- The area
- Why it is relatively safe to touch
- What kind of work is a good fit there

## Examples

### Example 1

User says: `Before I change anything, help me understand this repo and where I
should start.`

Actions:

1. Inspect the repo root, docs, and major directories
2. Identify tooling, entry points, and boundaries
3. Summarize active surfaces and safe starting points

Result: The user gets a concrete orientation report for immediate follow-on
work.

### Example 2

User says: `Map this monorepo and tell me which package is safest for a first
small change.`

Actions:

1. Review package layout and runtime boundaries
2. Identify validation commands and generated areas
3. Recommend low-risk starting surfaces with reasons

Result: The user gets a repo map plus a short list of safe entry points.

## Troubleshooting

### Problem: The Repo Has Little Or No Documentation

Lean harder on direct evidence from configs, manifests, entry points, and test
layout. Say explicitly that the mental model is code-derived rather than
doc-backed.

### Problem: The Monorepo Is Too Large For A Full Pass

Narrow the scope to the packages or services most relevant to the user's next
step. A partial but concrete map is better than a shallow global survey.

### Problem: A Boundary Is Only Inferred

Label it as an inference and explain what evidence supports it. Do not present
hidden architecture as a fact.

## Quality Bar

- Be concise but specific
- Prefer named files and directories over generic descriptions
- Distinguish facts from inferences
- Use `.ai/swe.json` only as an optional local default layer for relevant keys
- Do not pretend to understand hidden architecture that is not visible in the
  repo
- Make the report useful for immediate follow-on engineering work
