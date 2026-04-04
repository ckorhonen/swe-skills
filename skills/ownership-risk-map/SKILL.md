---
name: "swe:ownership-risk-map"
description: >-
  Maps engineering ownership risk in a repository using repo evidence such as
  git history, churn, bus factor, CODEOWNERS coverage, test density, and
  orphaned or unclear-owner surfaces. Use when a user says `map ownership
  risk`, `find bus factor hotspots`, `which files look orphaned`, `high-change
  low-test areas`, or asks for a recurring maintenance pass that identifies
  risky surfaces before they become incidents. Do NOT use for org charts, HR
  ownership assignments, or generic maintainer lists without repo evidence.
compatibility: >-
  Requires local repository access and works best with git history, CODEOWNERS
  files, test layout, and any CI or coverage signals that help separate risky
  hotspots from well-covered surfaces.
metadata:
  short-description: Map repository ownership risk from repo evidence
---

# SWE Ownership Risk Map

## What This Skill Does

Use this skill to identify where a repository is most exposed to ownership
risk, not to build a people directory.

The goal is to produce a ranked map of surfaces that are likely to become
fragile because of:

- concentrated commit ownership
- high churn with few distinct contributors
- unclear or missing CODEOWNERS coverage
- low test density near important code paths
- stale or orphaned modules, scripts, or configs
- recent turnover or repeated handoffs in the same surface

The output should be suitable for scheduled maintenance: short, repeatable, and
easy to compare across runs.

## When To Use

Use this skill when the user wants to:

- find the highest-risk ownership hotspots in a repo
- identify likely bus-factor problems before a change or release
- run a recurring maintenance pass over high-churn or low-ownership areas
- see which surfaces need better ownership, tests, or documentation

## Do Not Use

Do not use this skill for:

- assigning people to teams or building an org chart
- generic repo orientation with no ownership-risk goal
- general bug hunting or refactor planning
- security audits that are not specifically about ownership risk

## Inputs To Confirm

Confirm or infer:

- repository or package scope
- time window for the analysis, if any
- whether the user wants the whole repo or a selected folder/package
- whether CODEOWNERS or similar ownership metadata is available
- whether the user wants a report-only pass or a ranked maintenance backlog

If the scope is missing, infer the current repository root and use a recent
history window, but say so explicitly.

## What To Optimize For

- concrete repo evidence
- honest unknowns when ownership is unclear
- a short ranked list instead of a flat dump of names
- actions that reduce ownership risk without broad rewrites
- repeatable maintenance output that can be run on a schedule

## Instructions

### Step 1: Define The Scope

State the exact repo, package, folder, or service being reviewed.

If the user gives a time window, respect it exactly. If they do not, use the
smallest recent-history window that still gives useful signal.

### Step 2: Collect Ownership Evidence

Gather evidence from sources such as:

- git history and commit authorship
- churn over the chosen time window
- CODEOWNERS or similar ownership files
- test files and nearby validation coverage
- CI or flaky-test signals tied to the surface
- recent PRs or handoff clues in commit messages when available

Prefer direct evidence over inference. When you infer ownership risk from a
pattern, label it as an inference.

### Step 3: Identify Risk Surfaces

Look for surfaces such as:

- files with a single dominant committer
- high-change areas with only one or two contributors
- code paths with weak tests or no nearby validation
- configs, scripts, or glue code that seem maintained by no one
- modules that have changed recently but lack clear ownership metadata
- cross-cutting surfaces touched by many changes but few distinct owners

Rank each surface by the combination of:

- bus factor
- change frequency
- test or validation coverage
- ownership clarity
- operational blast radius

### Step 4: Separate Facts From Inference

For every risky surface, say:

- what is directly observed
- what is inferred
- what remains unknown

Do not invent a maintainer just to make the map look complete.

### Step 5: Propose Maintenance Actions

For the highest-risk surfaces, propose the smallest sensible follow-up actions
such as:

- add or update CODEOWNERS coverage
- add a small validation test near the hotspot
- document the ownership boundary in repo guidance
- reduce hidden coupling with a narrow refactor
- add a recurring review item for the surface

Keep the actions small and ownership-focused. Do not turn the map into a
general cleanup backlog.

### Step 6: Make It Recurring-Friendly

If the user implies a scheduled pass, include what should be compared across
runs:

- changed ranking
- new or removed hotspots
- surfaces that improved after prior follow-up
- surfaces that remain orphaned or under-covered

### Step 7: Keep The Output Evidence-Backed

If the repo does not have enough signal for a confident map, say so directly and
list the missing evidence rather than guessing.

## Output Requirements

Provide a report with these sections:

1. Scope reviewed
2. Evidence summary
3. Ranked ownership-risk surfaces
4. Recommended maintenance actions
5. Unknowns or gaps

For each ranked surface, include:

- area or files
- observed evidence
- inferred risk signal
- why it matters
- confidence level
- smallest follow-up action

For any surface where evidence is weak, include:

- what made the signal weak
- what would strengthen it
- explicit no-guess decision

## Quality Bar

- Rank by ownership risk, not by contributor count alone.
- Keep the output short enough to compare between recurring runs.
- Distinguish evidence from inference.
- Prefer repository signals over people assumptions.
- Be honest when ownership is unclear or missing.
- Recommend only actions that directly reduce ownership risk.
