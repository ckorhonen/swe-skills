---
name: "swe:recent-commit-bug-hunt"
description: "Scan recent commits across a scoped set of repositories, identify likely bugs using only concrete repo evidence, and propose minimal remediation sessions."
metadata:
  short-description: Find likely bugs in recent commits
---

# SWE Recent Commit Bug Hunt

Use this skill when the user wants to inspect recent commits across one or more repositories and identify likely bugs introduced recently.

Example scope: scan all ProjectOpenSea repositories for commits by `ckorhonen` in the last 24 hours, then propose minimal fix sessions.

## Goal

Review recent commits within the requested scope and identify likely bugs using only concrete repository evidence.

Concrete evidence includes:

- Commit SHAs
- Pull requests
- File paths
- Diffs
- Failing tests
- CI failures or warnings
- Local validation signals directly tied to the changed area

If the evidence is weak, report the suspicious finding and skip the fix proposal.

## Scope Rules

- Respect the user-provided repository set, author filter, and time window exactly.
- If the user names a repo group or org surface, stay within that scope.
- If the user specifies an author or contributor, filter to that author only.
- If the user provides a time window such as "last 24 hours", use that exact window.
- If scope is missing, ask for the repo set, author, and timeframe before proceeding.

## Hard Constraints

- Use only concrete repo evidence.
- Do not invent bugs.
- Do not overstate confidence.
- Do not propose speculative fixes when the evidence is weak.
- Prioritize the smallest safe fix possible.
- Avoid refactors, cleanup work, or unrelated improvements.
- Keep each remediation proposal tightly scoped to the implicated files and behavior.

## What To Look For

Focus on recent-change failure modes such as:

- Changed conditionals that likely broke a branch or guard
- Removed or inconsistent validation
- Interface mismatches across a call boundary
- Incomplete multi-file updates
- Broken mappings, serializers, or adapters
- Missing null, error, or edge-case handling introduced by the change
- Tests or CI failures directly tied to the changed surface

## Required Workflow

1. Define the scope precisely: repositories, author, and time window.
2. Collect recent commits in that scope and any linked PR, review, or CI context.
3. Inspect diffs and changed files for concrete regression signals.
4. Run targeted validation when useful and when it directly strengthens or weakens the evidence.
5. Separate findings into:
   - Strong evidence: concrete failure or very specific regression signal
   - Moderate evidence: diff-backed likely bug with clear local impact
   - Weak evidence: suspicious but not strong enough to justify a fix proposal
6. Only propose remediation sessions for strong or moderate findings.
7. Rank results best-first by confidence, impact, and safety of the minimal fix.

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

## Output Requirements

Provide a report with these sections:

1. Scope reviewed
2. Ranked findings
3. Weak-signal findings skipped
4. Proposed remediation sessions

For each identified issue, include:

- Repo
- Commit SHA(s) and PR(s), if available
- Relevant file(s)
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

## Session Proposal Format

For every issue that clears the evidence bar, propose a small remediation session that includes:

- Session name
- Objective
- Target repo
- Expected files to touch
- Minimal fix strategy
- Validation plan

Prefer one issue per session unless two issues share the same tiny write surface and can safely be fixed together.

## Quality Bar

- Be conservative and evidence-led
- Use exact SHAs, PRs, paths, tests, and CI signals whenever available
- If no issues meet the evidence bar, say so clearly
- Keep the proposed fixes minimal and tightly scoped
