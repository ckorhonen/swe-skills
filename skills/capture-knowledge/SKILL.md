---
name: "swe:capture-knowledge"
description: >-
  Audits a repository's code and docs to find important conventions, workflows,
  and architectural decisions that are missing from agent-facing guidance, then
  drafts review-ready updates. Use when a user says `capture repo knowledge`,
  `document implicit conventions`, `turn repo patterns into agent rules`, or
  asks what future agents should remember about a codebase. Do NOT use for a
  generic repo tour, onboarding walkthrough, or architecture summary that does
  not need reusable guidance updates.
compatibility: >-
  Requires a local repository checkout plus access to docs and existing
  agent-facing guidance files. Works best with shell access and standard repo
  discovery tools such as `git`, `fd`, and `rg`.
metadata:
  short-description: Draft missing repo knowledge for agent review
---

# SWE Capture Knowledge

## What This Skill Does

Use this skill to convert implicit repo knowledge into explicit guidance that
future agents can follow reliably.

The job is not to summarize the repo. The job is to compare:

- What the repo actually does
- What the existing agent guidance already says
- What high-signal guidance is still missing

Then draft the missing entries and stop for review before writing anything.

## When To Use

Use this skill when the user wants to:

- Capture undocumented repo conventions
- Turn repeated implementation patterns into reusable agent guidance
- Find what current rules or skills are missing
- Draft agent-facing guidance updates before saving them

## Do Not Use

Do not use this skill for:

- A general repo orientation report with no writing goal
- A broad architecture review that will not produce guidance updates
- A documentation audit for human-facing docs only
- Automatic write-back without an explicit review step

## Inputs To Confirm

Before doing deep work, confirm or infer:

- The repo or paths in scope
- Which guidance files count as agent-facing guidance
- Whether the user wants draft-only output or draft-plus-write after approval
- Any write restrictions for where approved entries may be saved

If the scope is missing, ask for the narrowest clarification needed before
proceeding.

## Instructions

### Step 1: Inventory Existing Guidance

Inspect the current agent-facing guidance first, such as:

- `AGENTS.md`, `CLAUDE.md`, and repo-level workflow docs
- Existing skills
- Agent rules, prompts, or operating docs
- Any docs that future agents are expected to follow

Capture what is already documented so you do not restate it later.

### Step 2: Inspect Repo Reality

Inspect the codebase, configs, tests, and representative implementations to
understand how the repo is actually built and maintained.

Focus on repeated or operationally important patterns such as:

- Architectural boundaries
- Naming and file placement conventions
- Testing and release expectations
- Dependency or package management norms
- Repeated extension points or adapter patterns
- Local rules that override framework defaults

### Step 3: Identify Real Knowledge Gaps

Compare observed repo behavior against the existing guidance and keep only the
highest-signal gaps.

Prioritize:

- Patterns that show up repeatedly
- Decisions that will change future agent behavior
- Guidance that is currently absent or materially under-specified

Avoid:

- Generic advice that applies to any repository
- Trivia that will not change agent behavior
- One-off exceptions unless they are operationally important
- Restating guidance that is already documented well enough

### Step 4: Draft A Review Packet

For each proposed entry, include:

- Title
- Type: `pattern`, `convention`, or `architectural-decision`
- Why it matters
- Evidence
- Proposed entry text
- Suggested destination
- Confidence

Ground every draft in concrete evidence from named files, directories, configs,
or repeated code patterns. Distinguish observed facts from inferences.

### Step 5: Pause For Review

Do not save proposed entries automatically.

Always:

1. Investigate
2. Draft candidate entries
3. Ask the user to review
4. Save only after explicit approval

If the user approves only a subset, save only that subset.

### Step 6: Save Approved Entries Narrowly

When writing approved entries, choose the narrowest correct destination:

- Agent rules
- A specific existing skill
- A new skill, if the pattern is large enough to deserve one
- Repository documentation
- Another agent-facing guidance file

Explain why that destination is the right place.

## Output Requirements

Produce a review packet with these sections:

1. Existing guidance reviewed
2. Candidate knowledge gaps
3. Proposed entries for review
4. Suggested save targets

Prefer 3-7 strong entries over a long weak list.

## Examples

### Example 1

User says: `Review this repo and capture the conventions future agents keep
missing.`

Actions:

1. Inspect `AGENTS.md`, `README.md`, and existing skills
2. Sample implementation patterns across the repo
3. Draft only the missing guidance items with evidence
4. Present them for review before writing

Result: The user gets a small, high-signal review packet instead of a long repo
summary.

### Example 2

User says: `Turn the implicit release workflow in this repo into agent guidance,
but do not save anything until I approve it.`

Actions:

1. Inspect release docs, CI config, and recent release-related changes
2. Compare those patterns to existing agent guidance
3. Draft proposed workflow guidance with exact evidence
4. Pause for approval

Result: Draft guidance is ready for review with a clear suggested destination.

## Troubleshooting

### Problem: The Repo Already Has Extensive Guidance

If the existing guidance already captures the important behavior, say so
explicitly. Return `No material knowledge gaps found` rather than forcing weak
proposals.

### Problem: The Evidence Is Ambiguous

Do not promote uncertainty into a rule. Present the item as a candidate for
confirmation, explain what you observed, and state exactly what still needs to
be verified.

### Problem: The User Wants Immediate Write-Back

If the user wants edits saved, you can prepare the write targets and draft text
in the same pass, but still show the proposed entries before writing so the
review step is explicit.

## Quality Bar

- Keep entries concrete and reusable
- Capture repo-specific behavior, not generic engineering advice
- Make the review packet easy to approve or reject item by item
