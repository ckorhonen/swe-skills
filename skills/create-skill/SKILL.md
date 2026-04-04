---
name: "swe:create-skill"
description: >-
  Creates or revises `swe:` skills for this repository using a repeatable
  authoring workflow: define concrete use cases, tune trigger boundaries,
  apply progressive disclosure, add matching eval assets, and validate the
  package. Use when adding a new skill, tightening an existing skill that
  over- or under-triggers, or distilling an external workflow into a
  repo-ready skill. Do NOT use for generic documentation edits or for
  executing the workflow the skill would describe.
compatibility: >-
  Requires local checkout access to this repository plus the ability to inspect
  existing skills, eval assets, and repo guidance files such as `README.md` and
  `AGENTS.md`. Works best when any external reference material has already been
  fetched or summarized locally before drafting begins.
metadata:
  short-description: Create repo-ready SWE skills with matching evals
---

# SWE Create Skill

## What This Skill Does

Use this skill to author or revise a `swe:` skill package for this repository in
a way that is:

- grounded in concrete user workflows
- narrow enough to trigger reliably
- consistent with this repo's skill and eval conventions
- easy to validate and improve over time

This skill distills the Anthropic skill-building guidance into a repo-specific
authoring workflow.

The outcome should usually include:

- one `skills/<slug>/SKILL.md`
- one matching `evals/<slug>/README.md`
- one matching `evals/<slug>/rubric.md`
- one matching `evals/<slug>/cases.json`
- any required updates to `README.md` or `AGENTS.md`

## When To Use

Use this skill when the user wants to:

- add a new `swe:` skill to this repository
- revise an existing skill that is too broad, too narrow, or structurally weak
- turn an external guide or repeated workflow into a reusable repo-local skill
- standardize how future skill authors package instructions and evals

## Do Not Use

Do not use this skill for:

- implementing the engineering workflow that the skill would later describe
- generic repo documentation cleanup with no skill-authoring goal
- one-off prompts that are not repeatable enough to justify a skill
- large repository policy rewrites unrelated to skill authoring

## Inputs To Confirm

Confirm or infer:

- whether the work is a new skill or a revision to an existing one
- the target workflow, user outcome, and success criteria
- 2-3 realistic trigger phrases a user would actually say
- the important non-goals or negative triggers
- whether the skill depends on local tooling, MCP integrations, or external
  references
- whether matching eval assets already exist or must be created

If the request is underspecified, ask only for the missing workflow boundary
needed to keep the skill narrow.

## Instructions

### Step 1: Start With Concrete Use Cases

Define 2-3 specific use cases before writing the skill.

For each use case, capture:

- user request
- workflow steps Claude should perform
- result the user should get

Only proceed if the workflow is repeatable and benefits from consistent
instructions.

### Step 2: Inspect Local Skill Conventions First

Read the repository's current guidance and analogous skills before drafting.

At minimum, inspect:

- `AGENTS.md`
- `README.md`
- one or two nearby `skills/*/SKILL.md` examples
- the matching `evals/*` assets for those examples

Honor these repo-specific rules:

- skill frontmatter `name` must start with `swe:`
- skill folder names stay kebab-case without the `swe:` prefix
- every skill needs a matching `evals/<slug>/` directory
- `README.md` must stay accurate when the skill inventory changes

### Step 3: Define The Trigger Boundary

Write the trigger boundary before drafting the full body.

The frontmatter description should state:

- what the skill does
- when to use it
- a few realistic trigger phrases
- at least one clear non-goal when over-triggering is plausible

Prefer specific requests over vague categories. A skill that says
`help with engineering` is not acceptable.

### Step 4: Design For Progressive Disclosure

Keep the skill package layered:

- frontmatter should be concise and triggerable
- `SKILL.md` should hold the full workflow
- only add `scripts/`, `references/`, or `assets/` when they materially improve
  execution or keep the main skill readable

Do not inline large reference material if a short summary plus targeted lookup is
enough.

### Step 5: Draft The Skill Body

Draft the `SKILL.md` body using this repository's required structure:

- `## What This Skill Does`
- `## When To Use`
- `## Do Not Use`
- `## Inputs To Confirm`
- `## Instructions`
- `## Output Requirements`
- `## Quality Bar`

Make the instructions operational:

- sequence the workflow clearly
- name evidence sources or required artifacts
- specify hard constraints when needed
- keep output shape reviewable
- prefer concrete language over broad advice

Add optional sections only when they help, such as:

- `## Tooling Stance`
- `## Parallelization Rule`
- `## Examples`
- `## Troubleshooting`

### Step 6: Draft Matching Eval Assets

Create or update:

- `evals/<slug>/README.md`
- `evals/<slug>/rubric.md`
- `evals/<slug>/cases.json`

The eval set should test the real contract of the skill, not generic prose
quality.

Include cases that cover a mix of:

- a clear happy path
- a bounded-scope or report-only variant
- an edge case involving missing evidence, missing tooling, or conflicting scope

Prefer review questions that make the reviewer inspect whether the response
stayed within the workflow boundary.

### Step 7: Validate And Tune

After drafting, run the repo validators and use any failures to refine the
package:

- `npm run evals:check`
- `npm run lint:md`

If the skill still seems likely to over-trigger or under-trigger, tighten the
frontmatter description before expanding the body.

### Step 8: Update Repo Guidance Narrowly

If the new skill changes the public inventory or authoring workflow, update the
narrowest correct guidance files, usually:

- `README.md`
- `AGENTS.md`

Do not broaden unrelated policy text.

## Output Requirements

When creating or revising a skill, provide:

1. the skill slug and frontmatter `name`
2. the workflow boundary in one short paragraph
3. the files created or updated
4. the key trigger phrases and non-goals
5. the validation commands run and their outcomes
6. any remaining risks, such as likely over-triggering or missing ecosystem
   examples

If the request is draft-only, return a review packet instead of writing files.

## Quality Bar

- Start from concrete use cases, not abstract capability names.
- Keep the workflow narrow enough that it triggers reliably.
- Follow repo conventions exactly for naming, sections, and eval layout.
- Use progressive disclosure instead of bloating `SKILL.md`.
- Include explicit non-goals when the scope could blur.
- Make the eval cases test the skill's actual contract.
- Update repo guidance only where the new skill changes documented behavior.
