---
name: "swe:docs-drift-audit"
description: >-
  Audits a repository for human-facing or operational documentation that drifted
  from code, config, interfaces, workflows, or repo structure changes. Use when
  a user says `check docs drift`, `docs are stale`, `update the runbook after
  this change`, or `what documentation is missing after this change`. Do NOT use
  for agent-guidance updates, generic documentation rewrites, or writing docs
  without evidence that they are stale.
compatibility: >-
  Requires local repository checkout and access to docs, changelogs, configs,
  code, and recent git history. Works best with shell access plus standard repo
  discovery tools such as `git`, `fd`, and `rg`.
metadata:
  short-description: Audit repo docs for drift from code changes
---

# SWE Docs Drift Audit

## What This Skill Does

Use this skill to find documentation that no longer matches the repository's
current behavior.

The goal is not to rewrite docs broadly. The goal is to compare the repo's
current reality against its human-facing and operational documentation, then
report where drift exists and what should change.

Typical outputs include:

- a short list of documentation gaps or mismatches
- the code, config, or workflow evidence behind each gap
- the smallest documentation updates that would close the gap
- explicit notes for anything that looks stale but is not yet proven

## When To Use

Use this skill when the user wants to:

- check whether docs still match a recent code or config change
- audit runbooks, READMEs, changelogs, or operational docs for drift
- find missing docs after a workflow, interface, or structure change
- prepare a bounded documentation update plan based on repo evidence

## Do Not Use

Do not use this skill for:

- updating agent-facing guidance such as `AGENTS.md` or `CLAUDE.md`
- rewriting documentation for style alone
- generic repo orientation with no docs-mismatch goal
- inventing documentation from product expectations instead of repo evidence

## Inputs To Confirm

Confirm or infer:

- repo or package scope
- which documentation families matter most
- whether the user wants report-only output or a doc-update plan
- whether a recent change, PR, or commit range is the primary trigger
- any no-touch areas, such as generated docs or external docs owned elsewhere

If the scope is unclear, ask for the smallest useful boundary before proceeding.

## Instructions

### Step 1: Define The Change Surface

Start by identifying the change surface that may have caused drift.

Inspect:

- recent commits or the referenced PR
- changed code, config, or interfaces
- workflows, scripts, routes, jobs, or repo structure changes

Name the actual affected surfaces before looking at docs.

### Step 2: Inventory Relevant Documentation

Identify the human-facing and operational docs that should reflect the change.

Look for:

- README files
- runbooks
- operational playbooks
- setup or deployment docs
- changelogs or release notes
- architecture or workflow docs
- docs embedded in package or service directories

Only include docs that should plausibly change given the inspected surface.

### Step 3: Compare Docs Against Repo Reality

Compare the docs to the current codebase and recent changes.

Focus on mismatches such as:

- stale commands or paths
- changed flags, env vars, or interfaces
- renamed files, services, or directories
- workflow steps that no longer match reality
- omitted operational steps created by the change
- examples that still describe old behavior

Treat `maybe stale` as insufficient. Tie each finding to evidence.

### Step 4: Separate Drift From Broader Rewrite Work

Keep the findings narrow.

Report only documentation changes that are directly justified by the repo
evidence. If a doc is broadly bad but not actually stale, do not turn that into
drift.

If the best fix would require a full rewrite, call that out as a separate
documentation project rather than pretending it is a drift patch.

### Step 5: Prioritize What Matters Operationally

Rank findings by likely impact:

- developer workflow breakage
- operator confusion or unsafe execution
- onboarding friction
- cosmetic or low-risk inaccuracies

Prefer the smallest doc changes that restore accuracy and usefulness.

### Step 6: Propose Minimal Documentation Updates

For each drift item, specify:

- the doc surface
- the evidence that it is stale
- the smallest fix that would make it accurate again
- whether it should be updated immediately or queued

If a doc is missing entirely, treat that as a missing-doc finding only when the
new workflow is materially important.

## Output Requirements

Provide a report with these sections:

1. Scope reviewed
2. Documentation surfaces checked
3. Ranked drift findings
4. Missing-doc or stale-doc follow-ups
5. Recommended next edits

For each finding, include:

- doc surface
- affected code or workflow surface
- evidence of drift
- why it matters
- smallest recommended fix
- confidence level

For each follow-up, include:

- doc surface or gap
- why it was not treated as a confirmed drift finding
- what additional evidence would settle it

## Quality Bar

- Ground every finding in repo evidence.
- Keep the focus on documentation drift, not doc polish.
- Prefer operationally important mismatches over cosmetic ones.
- Do not confuse agent guidance updates with human-facing docs updates.
- Make the result usable as a short, actionable edit queue.
