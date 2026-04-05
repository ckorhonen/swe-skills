---
name: "swe:init"
description: >-
  Initializes an optional repo-local agent collaboration preference file at
  `.ai/swe.json` by running a short interview or a zero-question quick mode.
  Use when a user says `initialize agent settings for this repo`, `set up my
  local agent prefs here`, `run quick init for this project`, or `create
  .ai/swe.json for how I like to work`. Do NOT use for `npm init`, project
  scaffolding, dependency installation, or environment bootstrap.
compatibility: >-
  Requires a local repository checkout plus write access to the working tree.
  Works best when the repository already has agent-facing guidance such as
  `AGENTS.md` or `README.md`, and may optionally update `.gitignore` when the
  user requests local-only storage.
metadata:
  short-description: Initialize repo-local agent collaboration preferences
---

# SWE Init

## What This Skill Does

Use this skill to establish an optional repo-local preference layer for how
agents should collaborate in a specific repository.

The job is to:

- gather a short set of behavior-shaping preferences
- write them to `.ai/swe.json` as minified JSON
- keep the file local-first while allowing the user to commit it if they want
- define how later skills should consult the file safely

This skill is not a general repository bootstrapper. It configures agent
collaboration defaults, not the project's runtime or package setup.

## When To Use

Use this skill when the user wants to:

- initialize repo-local agent settings
- create a small preference file for how agents should work in this repo
- run a quick-start setup with opinionated defaults
- make later `swe:` skills respect local collaboration preferences

## Do Not Use

Do not use this skill for:

- `npm init`, `pnpm init`, or similar project scaffolding
- dependency installation or toolchain bootstrap
- `.env`, secret, or credential setup
- committed team policy unless the user explicitly wants the file checked in
- broad repo documentation or agent-guidance rewrites unrelated to the local
  preference layer

## Inputs To Confirm

Confirm or infer:

- whether the user wants full interview mode or quick mode
- whether `.ai/swe.json` already exists
- whether `.gitignore` should be updated
- whether any sensitive paths should trigger extra caution

If the user asks for quick mode, skip the interview entirely.

If `.ai/swe.json` already exists, do not overwrite it silently. Ask whether the
user wants to keep it, edit it, or replace it.

## Preference Contract

The preference file path is fixed:

- `.ai/swe.json`

The file format is fixed:

- minified JSON
- include `"v": 1`
- store only values that differ from the built-in defaults
- keep keys compact but legible

Use this schema:

- `v`: schema version
- `autonomy`: `bounded`, `ask`, or `assertive`
- `plan`: `minimal`, `short`, or `design`
- `scope`: `minimal`, `balanced`, or `broad`
- `verify`: `narrow`, `standard`, or `broad`
- `report`: `terse`, `evidence`, or `full`
- `alts`: `material` or `usually`
- `paths`: array of sensitive path strings

Do not write prose, Markdown, YAML, or duplicated default values.

## Built-In Defaults

Treat these as internal defaults, not required file contents:

```json
{"v":1,"autonomy":"bounded","plan":"short","scope":"minimal","verify":"standard","report":"evidence","alts":"material","paths":[]}
```

That means quick mode should normally write:

```json
{"v":1}
```

## Precedence Rule

Later skills should apply preferences in this order:

1. explicit user request
2. repository guidance such as `AGENTS.md` or `README.md`
3. `.ai/swe.json`
4. the skill's own defaults

Skills should consult `.ai/swe.json` only when the preference would materially
change behavior, such as planning, edit scope, validation, or reporting. A
missing or malformed file should fall back safely instead of blocking work.

## Instructions

### Step 1: Inspect The Current State

Check whether:

- `.ai/` exists
- `.ai/swe.json` exists
- `.gitignore` exists

If an existing preference file is present, read it before proposing any write.

### Step 2: Choose The Right Entry Path

If the user asked for quick mode, follow quick mode.

If the user asked for a normal setup, run the short interview.

If the request is actually about project scaffolding or runtime bootstrap,
redirect instead of forcing this skill.

### Step 3: Run The Short Interview Only When Needed

In full mode, ask one question at a time and keep the interview short.

Capture only preferences that materially change agent behavior:

1. `autonomy`
2. `plan`
3. `scope`
4. `verify`
5. `report`
6. `alts`
7. optional `paths`

Do not add soft personality questions that do not change execution behavior.

### Step 4: Normalize To The Compact Schema

Convert interview answers into the compact schema values.

Write only non-default overrides. For example:

```json
{"v":1,"autonomy":"ask","verify":"broad","paths":["infra/","migrations/"]}
```

### Step 5: Write `.ai/swe.json`

Create `.ai/` if it does not exist.

Write `.ai/swe.json` as minified JSON with no trailing explanation in the file.

Never silently replace an existing valid file. If the file is malformed, show
the parse problem briefly and ask before repairing or replacing it.

### Step 6: Update `.gitignore` Only When Requested

If the user explicitly asks for `--gitignore` or otherwise asks to keep the
file local-only, add this exact path if it is not already present:

- `.ai/swe.json`

Do not ignore the entire `.ai/` directory unless the user explicitly asks for
that broader behavior.

### Step 7: Summarize The Effective Result

At the end, summarize:

- which mode ran
- which file was written or preserved
- whether `.gitignore` changed
- which preferences were set explicitly
- the precedence rule future skills should follow

## Output Requirements

Provide a concise result that includes:

1. mode used: `quick`, `quick --gitignore`, or `interview`
2. file status for `.ai/swe.json`
3. whether `.gitignore` changed
4. the explicit non-default preferences saved
5. the precedence rule
6. any follow-up needed if an existing file was kept or not overwritten

If the request is out of scope, say so directly and redirect to the correct
workflow instead of producing a partial init plan.

## Examples

### Example 1

User says: `Initialize agent settings for this repo and ask me a short
questionnaire.`

Actions:

1. Check for an existing `.ai/swe.json`
2. Ask the compact interview one question at a time
3. Write only non-default overrides
4. Summarize the resulting local preference layer

Result: The repo gets a small machine-readable preference file without turning
into a broader bootstrap workflow.

### Example 2

User says: `Run swe:init --quick --gitignore here.`

Actions:

1. Check for an existing `.ai/swe.json`
2. Skip the interview
3. Write `{"v":1}`
4. Add `.ai/swe.json` to `.gitignore` if missing

Result: The repo gets the opinionated defaults in one fast local-first step.

### Example 3

User says: `npm init this repo and set up the package.json.`

Actions:

1. Recognize that the request is about project scaffolding
2. Do not load this workflow
3. Redirect to the appropriate repo bootstrap work

Result: This skill stays narrow and does not over-trigger on unrelated init
requests.

## Troubleshooting

### Problem: `.ai/swe.json` Already Exists

Do not replace it automatically. Show the current state and ask whether to keep
it, edit it, or replace it.

### Problem: The Existing File Is Invalid JSON

State that the file is malformed, show the parse issue briefly, and ask whether
to repair or replace it. Do not silently discard existing data.

### Problem: The User Wants The File Committed

That is allowed. Skip `.gitignore` changes unless the user explicitly asks for
local-only storage.

## Quality Bar

- Keep the workflow narrow and clearly separate it from project bootstrap
- Use `.ai/swe.json` and no alternate path by default
- Preserve local-first behavior without forcing `.gitignore` edits
- Write compact, machine-readable JSON only
- Store only non-default overrides
- Never silently overwrite an existing preference file
- Make the precedence rule explicit so future skills can consume the file
  safely
