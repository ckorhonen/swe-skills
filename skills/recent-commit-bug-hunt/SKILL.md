---
name: "swe:recent-commit-bug-hunt"
description: >-
  Scans recent commits in one or more repositories, identifies likely bugs
  using concrete repo evidence only, and proposes tightly scoped remediation
  sessions. Use when a user says `scan recent commits for bugs`, `what did I
  probably break`, `review yesterday's changes for regressions`, or asks for a
  commit-scoped bug hunt. Do NOT use for a broad code health review, full
  security audit, or speculative bug hunting with no repo or time scope.
compatibility: >-
  Requires local git history and works best with access to CI output, failing
  tests, linked PR metadata, or other validation signals tied to recent
  changes.
metadata:
  short-description: Find likely bugs in recent commits
---

# SWE Recent Commit Bug Hunt

## What This Skill Does

Use this skill to inspect recent code changes conservatively and separate:

- Real regression signals
- Plausible but weaker suspicions
- Noise that should not become a fix proposal

The outcome should be a ranked list of evidence-backed findings plus small,
behavior-focused remediation sessions for the findings that clear the bar.

## When To Use

Use this skill when the user wants to:

- Review recent commits for likely regressions
- Check whether their latest changes introduced bugs
- Mine recent PRs or SHAs for concrete bug signals
- Propose narrowly scoped follow-up fix sessions

## Do Not Use

Do not use this skill for:

- A generic code smell review
- A security or dependency audit
- A large-scale refactor plan
- Speculative bug hunting with no commit scope

## Inputs To Confirm

Confirm or infer:

- Repository set
- Author filter, if any
- Time window
- Whether linked PR or CI context is available
- Whether local validation can be run

If scope is missing, ask for the repo set, author, and timeframe before
proceeding.

## Evidence Sources

Concrete evidence includes:

- Commit SHAs
- Pull requests
- File paths
- Diffs
- Failing tests
- CI failures or warnings
- Local validation signals directly tied to the changed area

If the evidence is weak, report the suspicious finding and skip the fix
proposal.

## Hard Constraints

- Use only concrete repo evidence
- Do not invent bugs
- Do not overstate confidence
- Do not propose speculative fixes when the evidence is weak
- Prioritize the smallest safe fix possible
- Avoid refactors, cleanup work, or unrelated improvements
- Keep each remediation proposal tightly scoped to the implicated files and
  behavior

## Instructions

### Step 1: Define The Review Scope

Respect the user-provided repository set, author filter, and time window
exactly.

If the user names a repo group or org surface, stay within that scope.

### Step 2: Collect Recent Changes And Context

Gather the relevant commits and any linked:

- PR metadata
- Review context
- CI status
- Failing tests
- Local validation signals

### Step 3: Inspect Diffs For Regression Signals

Focus on recent-change failure modes such as:

- Changed conditionals that likely broke a branch or guard
- Removed or inconsistent validation
- Interface mismatches across a call boundary
- Incomplete multi-file updates
- Broken mappings, serializers, or adapters
- Missing null, error, or edge-case handling introduced by the change
- Tests or CI failures directly tied to the changed surface

### Step 4: Run Targeted Validation When It Strengthens The Evidence

Run the narrowest useful checks only when they directly strengthen or weaken the
case. Do not run broad unrelated test suites just to fill space.

### Step 5: Bucket Findings By Evidence Strength

Separate findings into:

- Strong evidence: concrete failure or very specific regression signal
- Moderate evidence: diff-backed likely bug with clear local impact
- Weak evidence: suspicious but not strong enough to justify a fix proposal

Only propose remediation sessions for strong or moderate findings.

## What Counts As A Good Finding

Every proposed issue should:

- Tie back to one or a few recent commits
- Name the exact repo and file surface
- Explain the concrete evidence
- Describe a minimal, behavior-focused fix
- Include a clear validation path

Avoid:

- Old bugs not clearly connected to the scoped commits
- General code smell with no bug signal
- Large rewrites
- Style-only issues
- Findings that require broad product or domain assumptions

### Step 6: Propose Minimal Remediation Sessions

For every finding that clears the evidence bar, propose one small remediation
session with:

- Session name
- Objective
- Target repo
- Expected files to touch
- Minimal fix strategy
- Validation plan

Prefer one issue per session unless two issues share the same tiny write
surface and can safely be fixed together.

## Output Requirements

Provide a report with these sections:

1. Scope reviewed
2. Ranked findings
3. Weak-signal findings skipped
4. Proposed remediation sessions

For each identified issue, include:

- Repo
- Commit SHA or SHAs and PRs, if available
- Relevant files
- Concrete evidence
- Why this is likely a bug
- Minimal fix to attempt
- Suggested validation
- Confidence level

For each weak-signal finding, include:

- Repo
- Commit or file reference
- What looked suspicious
- Why the evidence was insufficient
- Explicit no-fix decision

## Examples

### Example 1

User says: `Review my commits from the last 24 hours in billing-api and tell me
what I probably broke.`

Actions:

1. Filter the commit set to the requested author and timeframe
2. Inspect diffs plus CI or test signals
3. Rank only evidence-backed findings
4. Propose minimal fix sessions for the strong and moderate issues

Result: The user gets a short bug-hunt report instead of generic cleanup ideas.

### Example 2

User says: `Scan the last two merged PRs in checkout-service for likely
regressions and suggest the smallest fixes.`

Actions:

1. Gather the PRs, SHAs, changed files, and available validation context
2. Inspect interface boundaries, conditionals, and missing edge-case handling
3. Separate strong findings from weak suspicions
4. Propose only the smallest safe remediation sessions

Result: Each proposed fix is directly tied to a recent change and a clear
validation path.

## Troubleshooting

### Problem: The Scope Is Too Broad

If the request spans too many repos or too much history, narrow it before doing
deep analysis. A focused 24-72 hour window is usually more reliable than a
vague multi-month sweep.

### Problem: The Evidence Never Gets Past Weak Suspicion

Say so explicitly. Report the suspicious signals in the
`Weak-signal findings skipped` section and make the no-fix decision clear.

### Problem: Local Validation Cannot Be Run

Rely on diffs, CI, and directly linked repo evidence, but say what validation
was unavailable and lower your confidence accordingly.

## Quality Bar

- Be conservative and evidence-led
- Use exact SHAs, PRs, paths, tests, and CI signals whenever available
- If no issues meet the evidence bar, say so clearly
- Keep the proposed fixes minimal and tightly scoped
