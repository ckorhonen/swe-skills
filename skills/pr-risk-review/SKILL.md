---
name: "swe:pr-risk-review"
description: >-
  Reviews open or draft pull requests for engineering risk before merge,
  focusing on missing validation, hidden coupling, rollout and rollback gaps,
  migrations, feature flags, and other agent-safe next actions. Use when a
  user says `review this PR for risk`, `pre-merge review`, `is this PR safe to
  merge`, or asks for a risk-focused PR review. Do NOT use for post-merge
  production monitoring, broad code smell review, or commit-scoped bug hunting.
compatibility: >-
  Requires access to PR metadata, diffs, and preferably CI or validation
  signals. Works best with local checkout access, GitHub PR context, and the
  repository's own test or release workflow.
metadata:
  short-description: Review open PRs for merge risk
---

# SWE PR Risk Review

## What This Skill Does

Use this skill to review an open or draft pull request before merge and decide
where the engineering risk is concentrated.

The expected outcome is a concise risk report that tells the user:

- what the PR changes
- what makes it risky or low-risk
- what validation is missing or weak
- what rollout, rollback, or migration gaps still need attention
- what the smallest safe next action is

This skill is deliberately narrower than post-merge monitoring and bug hunting.
It is about merge readiness, not production impact and not retrospective defect
mining.

## When To Use

Use this skill when the user wants to:

- review a PR before merge
- decide whether a change is safe to merge
- identify missing tests, checks, or rollout planning on an open PR
- assess whether migrations, flags, or interface changes need extra caution
- get agent-safe follow-up actions without doing the merge

## Do Not Use

Do not use this skill for:

- post-merge production monitoring
- scanning recent commits for regressions after the fact
- a broad code style or architecture review with no PR scope
- general project planning or roadmap feedback
- security-specific review when the user explicitly asked for a security audit

## Inputs To Confirm

Confirm or infer:

- the PR number, branch, or diff scope
- the repository or service in scope
- whether CI or local validation data is available
- whether the user wants report-only output or a concrete follow-up plan
- any no-touch areas, rollout constraints, or deadlines

If the request is vague, ask for the PR link or number and the intended review
focus before proceeding.

## Optional Local Preference Layer

If `.ai/swe.json` exists and the current request or repo guidance does not
override it, this skill may consult only these keys:

- `verify`
- `report`
- `alts`
- `paths`

Use them only to refine defaults:

- `verify` can change how much follow-up validation to recommend
- `report` can change the detail level within the required report shape
- `alts` can control whether multiple safe next actions are surfaced when
  tradeoffs are real
- `paths` can raise caution for matching diff surfaces

Apply preferences in this order:

1. explicit user request
2. repo guidance such as `AGENTS.md` or `README.md`
3. `.ai/swe.json`
4. this skill's defaults

Do not let `.ai/swe.json` suppress concrete risk findings, reduce the evidence
bar, or override pre-merge scope.

## Tooling Stance

This skill is tool agnostic.

Use the strongest available evidence from:

- PR metadata and diffs
- CI status or failing checks
- local test or typecheck commands
- migration or rollout notes
- feature-flag or config changes
- release or rollback documentation

Prefer the repository's own validation commands and only broaden if the local
signals are insufficient.

## Instructions

### Step 1: Define The PR Scope

Capture the PR number or link, title, merge target, and changed files.

If the user gave only a branch name or short description, resolve it to the
specific PR before reviewing risk.

### Step 2: Map The Risk Surfaces

Inspect the diff and identify the concrete surfaces likely affected:

- APIs, handlers, jobs, or CLI entry points
- shared libraries or serialization boundaries
- schema or migration changes
- feature-flagged paths
- rollout, rollback, or compatibility-sensitive surfaces

Keep the mapping short and concrete. Do not widen the scope beyond what the PR
actually touches.

### Step 3: Check Validation Quality

Assess what evidence exists for the change being safe:

- tests added or updated
- existing tests that cover the changed paths
- CI status and failing checks
- local validation commands that apply to the touched surface
- missing validation for risky branches, edge cases, or migrations

Treat missing validation as a real risk signal when the PR changes behavior.

### Step 4: Check Rollout And Compatibility Risk

Look specifically for:

- backward-incompatible API or data changes
- migrations that need ordering, backfills, or cleanup
- feature flags without a clear default or rollback path
- interface changes that require coordinated updates
- config changes that can fail in partially deployed states
- hidden coupling across packages, services, or consumers

If the PR depends on an assumption outside the diff, say so explicitly.

### Step 5: Separate Strong From Weak Signals

Only report a finding when the evidence supports it.

Bucket observations into:

- strong risk: concrete gap, inconsistent update, or clear missing safeguard
- moderate risk: plausible issue with visible local impact
- weak signal: suspicious but not enough to justify a concrete recommendation

Do not inflate weak signals into firm findings.

### Step 6: Propose The Smallest Safe Next Action

For each strong or moderate finding, recommend one small next action such as:

- add a targeted test
- document the rollout or rollback assumption
- split the change into safer phases
- add a guard or compatibility shim
- verify the migration order
- add a feature-flag default or fallback

Keep recommendations tightly scoped and reviewable.

## Output Requirements

Provide a report with these sections:

1. Scope reviewed
2. Ranked risk findings
3. Weak-signal observations skipped
4. Recommended next actions

For each finding, include:

- PR number, title, and link if available
- relevant files or surfaces
- concrete risk evidence
- why this is a merge risk
- smallest safe next action
- suggested validation
- confidence level

For each weak-signal observation, include:

- what looked risky
- why the evidence was insufficient
- explicit no-action decision

## Quality Bar

- Stay pre-merge and do not drift into post-merge impact analysis
- Use concrete PR and diff evidence rather than generic review language
- Treat missing validation and rollout gaps as first-class risk signals
- Use `.ai/swe.json` only as an optional local default layer for relevant keys
- Keep the output short, prioritized, and directly actionable
- Prefer the smallest safe follow-up over broad redesign advice
