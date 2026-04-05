# Preference-Aware Skills Design

## Goal

Add a first wave of optional `.ai/swe.json` awareness to the existing `swe:`
skills that can materially benefit from local collaboration preferences.

The target is not every skill. The target is the subset where local
preferences can refine behavior without weakening evidence, scope discipline,
or required output structure.

## Why A Phased Rollout

The new `swe:init` skill creates a local preference layer, but the repository's
other skills do not yet describe how to consult it safely.

Adding that behavior everywhere at once would create two risks:

- skills with strong hard constraints might accidentally imply that local
  preferences can override repo rules
- low-value integrations would add wording and eval complexity without changing
  behavior meaningfully

The first rollout should focus on the skills where the preference layer changes
real decisions today.

## First-Wave Skills

The first wave is:

- `swe:change-validation-planner`
- `swe:pr-risk-review`
- `swe:repo-introspection`
- `swe:test-gap-hunt`

These skills already have discretionary behavior around:

- how much detail to include in plans and reports
- how broadly to validate after a narrow confidence boundary
- when to surface alternate options
- which paths to treat as caution zones
- how small an incremental batch should be when several are plausible

## Consumption Rule

Each skill should:

- consult `.ai/swe.json` only when the file exists and the relevant key would
  materially change behavior
- name only the keys that matter for that skill
- keep the precedence rule explicit

The precedence stays:

1. explicit user request
2. repo guidance such as `AGENTS.md` or `README.md`
3. `.ai/swe.json`
4. the skill's own defaults

## Skill-Specific Mapping

### `swe:change-validation-planner`

Relevant keys:

- `plan`
- `verify`
- `report`
- `alts`
- `paths`

Effects:

- `plan` changes how much detail the validation ladder includes
- `verify` changes how aggressively the planner recommends broader checks after
  the narrow path
- `report` changes concision, not required sections
- `alts` controls whether alternate validation ladders are surfaced when
  tradeoffs are real
- `paths` raises caution for sensitive directories without expanding scope

### `swe:pr-risk-review`

Relevant keys:

- `verify`
- `report`
- `alts`
- `paths`

Effects:

- `verify` changes how much follow-up validation to recommend
- `report` changes detail level within the required report shape
- `alts` controls whether multiple safe next actions are surfaced
- `paths` treats matching diff surfaces as higher-caution review areas

### `swe:repo-introspection`

Relevant keys:

- `report`
- `alts`
- `paths`

Effects:

- `report` changes how concise or detailed the orientation is
- `alts` controls whether multiple safe entry points are surfaced
- `paths` keeps matching areas out of the default "safe starting points" set
  unless the user explicitly asks for them

### `swe:test-gap-hunt`

Relevant keys:

- `plan`
- `scope`
- `verify`
- `report`
- `paths`

Effects:

- `plan` changes the depth of execution-plan and backlog detail
- `scope` nudges the skill toward a smaller or slightly broader incremental
  batch when multiple choices are viable
- `verify` changes how quickly the validation plan broadens after targeted
  checks
- `report` changes detail level within the required sections
- `paths` treats matching surfaces as avoid-or-ask-first areas by default

## Hard Limits

No skill should let `.ai/swe.json`:

- override explicit user instructions
- override repo rules
- remove required output sections
- lower the evidence bar
- justify skipping honest unknowns
- broaden scope beyond the skill's non-goals

The preference layer refines defaults. It does not replace the skill contract.

## Eval Changes

Each first-wave skill should gain:

- one preference-aware case in `cases.json`
- a rubric line that checks for safe preference consumption
- a README case-list update

The new cases should verify both halves of the contract:

- the skill actually uses the relevant local preferences
- the skill does not let those preferences override stronger instructions

## Validation Plan

The follow-up should pass:

- `npm run evals:check`
- `npm run lint:md`
- targeted packet generation for the touched skills
