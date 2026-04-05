---
name: "swe:babysit-pr"
description: >-
  Babysits an open pull request end-to-end by polling every minute, triaging
  new comments and reviews, handling CI failures, iterating on reviewer
  scores, and stopping only when the PR is ready to merge. Use when a user
  says `babysit this PR`, `watch this PR until it's merge-ready`, `handle
  review feedback on my PR`, or `keep iterating on this PR until reviewers are
  happy`. Do NOT use for a one-shot PR risk review, merged PR production
  monitoring, or repo-wide CI debugging with no scoped PR.
compatibility: >-
  Requires access to GitHub PR metadata, comments, reviews, and CI runs plus
  permission to react, comment, push commits, and rerun checks on the PR
  branch. Works best with an authenticated `gh` CLI session and a clean local
  checkout of the PR head branch.
metadata:
  short-description: Watch one PR until it is merge-ready
---

# SWE PR Babysitting

## What This Skill Does

Use this skill to take one open pull request from active review to merge-safe
state with minimal manual intervention.

The job is to keep a live watch loop going, absorb new feedback, push fixes,
explain disagreements when feedback is invalid, and only stop when one of
these terminal states is reached:

- the PR is ready to merge
- the PR is merged or closed
- a blocker requires user or reviewer input

The expected outcome is not a one-shot review. It is an active PR shepherding
loop that keeps working until the branch is either safe to merge or explicitly
blocked.

## When To Use

Use this skill when the user wants to:

- babysit one open PR until it is merge-ready
- watch for review comments, change requests, and CI failures continuously
- apply small follow-up fixes and push them without waiting for manual nudges
- keep iterating until a reviewer or review bot gives the highest available
  score
- end with a clear `ready to merge` or `blocked` outcome

## Do Not Use

Do not use this skill for:

- a one-time risk review with no ongoing watch loop
- post-merge production impact checks
- repo-wide CI triage without a scoped PR
- ambiguous product or design decisions that require fresh user direction
- unrelated worktree cleanup or broad refactors outside the PR

## Inputs To Confirm

Confirm or infer:

- the PR number, URL, or branch to watch
- the repository scope if the PR target is ambiguous
- whether the local checkout is clean enough to edit safely
- whether the agent is allowed to push commits, reply on GitHub, and rerun
  checks
- any no-touch files, rollout constraints, or reviewer-specific expectations

If the request is vague, ask only for the missing PR identifier needed to lock
onto one PR.

## Tooling Stance

Prefer GitHub-native evidence and actions:

- `gh pr view` for mergeability, review decision, head branch, and head SHA
- `gh pr checks` plus `gh run view` for CI state and failed logs
- `gh api` review and comment endpoints for issue comments, inline comments,
  reviews, and reactions
- the local checkout for code changes, validation, commits, and pushes

If a repo has a stronger local helper for PR watching, use it. Otherwise, drive
the loop directly with `gh` and local git commands.

## Instructions

### Step 1: Lock To One PR And Establish Watch State

Resolve the exact PR and capture:

- PR number and URL
- head branch and current head SHA
- mergeable state and merge state status
- current review decision
- current CI snapshot

Create a small working state for the session that tracks:

- seen issue comment IDs
- seen inline review comment IDs
- seen review IDs
- retries per head SHA
- outstanding ambiguous or invalid-feedback threads
- the highest explicit reviewer score observed, if any

If the worktree has unrelated uncommitted changes, stop and ask the user before
editing the PR branch.

### Step 2: Run A 60-Second Watch Loop

Poll the PR every 60 seconds until a terminal state is reached.

Each pass should refresh:

- PR metadata and review decision
- issue comments
- inline review comments
- review summaries and requested-changes state
- CI checks and workflow runs

Do not stop on the first green snapshot. Keep watching until feedback,
mergeability, CI, and any score gate all indicate the PR is ready.

### Step 3: Triage New Comments And Reviews

For each new substantive issue comment, inline review comment, or review
summary:

1. read the full comment in context
2. add an acknowledgement reaction promptly, such as `eyes`
3. classify it as one of:
   - actionable feedback
   - ambiguous feedback
   - invalid feedback
   - non-actionable noise

Ignore obvious noise only after reading it once and confirming it does not
change merge readiness.

### Step 4: Address Actionable Feedback

When feedback is technically valid and in scope for the PR:

1. make the smallest correct code or docs change on the PR branch
2. run the narrowest useful validation first
3. broaden validation only when the risk surface requires it
4. commit and push once the change is ready
5. reply on the PR with a concise note saying what changed and where

If a review explicitly requests changes, treat that as blocking until the
follow-up change is pushed or the reviewer confirms the concern is resolved.

### Step 5: Handle Ambiguous Feedback Without Guessing

If a comment is unclear, incomplete, or open to multiple valid
interpretations:

- do not guess
- ask a concise clarifying question on the PR or to the user, depending on who
  owns the ambiguity
- present 2-3 concrete options with the tradeoff of each option
- keep the loop alive, but mark the PR as blocked on clarification

Do not push speculative changes just to keep the loop moving.

### Step 6: Handle Invalid Feedback By Explaining Why

If feedback would regress correctness, violate explicit requirements, conflict
with repo guidance, or undo a necessary safeguard:

- do not implement it blindly
- reply with a concise evidence-backed explanation
- cite the relevant file, test, contract, CI result, or requirement
- propose a smaller safe alternative when one exists

Treat this as addressed only after the rationale is posted and the thread is no
longer waiting on silent action from the agent.

### Step 7: Treat Review Decisions And Scores As Iteration Gates

Requested changes and unresolved review feedback are blocking.

If a reviewer or review bot provides an explicit numeric score such as `3/5` or
`4/5`:

- treat any score below the maximum on that scale as incomplete
- keep iterating until the highest available score is reached
- do not invent or assume a score when none was provided

If the score cannot improve without a product decision or external dependency,
surface that blocker explicitly instead of pretending the PR is done.

### Step 8: Diagnose CI Before You Retry Or Fix

When CI fails:

1. inspect the failing checks and logs first
2. classify the failure as:
   - branch-related and caused by the PR
   - flaky or unrelated to the PR
   - blocked on infrastructure or permissions
3. for branch-related failures:
   - patch the branch
   - validate narrowly
   - commit and push
4. for flaky or unrelated failures:
   - rerun only after one inspection confirms that classification
   - cap retries per SHA so the loop does not spin forever
5. for infra-only blockers:
   - tell the user exactly what failed and why the loop cannot resolve it

Never rerun failed CI blindly without looking at the logs first.

### Step 9: End Only At A Real Terminal State

Stop the loop only when one of these is true:

- the PR is merged or closed
- CI is green, mergeability is not blocking, all substantive comments are
  addressed, any requested changes are resolved, any explicit score gate is at
  the top of its scale, and the latest review state indicates the code is safe
  and ready to merge
- a blocker requires user or reviewer help

When a terminal state is reached, notify the user immediately and summarize the
current status.

## Output Requirements

During the loop, keep updates short and state-based. Report only when something
changed materially:

- new feedback arrived
- a fix was pushed
- CI changed state
- the PR became blocked or ready

At the terminal state, provide:

1. PR number or URL
2. terminal outcome: `ready to merge`, `merged or closed`, or `blocked`
3. comments and reviews handled
4. CI status and any reruns or fixes performed
5. score status if a reviewer used a numeric score
6. exact blocker or remaining risk, if any

## Quality Bar

- Keeps one PR in scope and maintains a real 60-second watch loop
- Reads and acknowledges new substantive feedback instead of skipping it
- Distinguishes actionable, ambiguous, and invalid feedback correctly
- Uses evidence before disagreeing with a reviewer or classifying CI as flaky
- Keeps fixes small, reviewable, and tied to the PR
- Does not declare victory while comments, score gates, merge blockers, or CI
  failures remain

## Examples

### Example 1

User says: `Babysit PR #247 until it is ready to merge. Handle comments and CI
for me.`

Actions:

1. lock onto PR #247 and start the 60-second watch loop
2. react to new review comments and classify them
3. push fixes for valid feedback
4. investigate CI failures before reruns
5. stop only when the PR is merge-safe or blocked

Result: The user gets a persistent PR shepherding pass instead of a one-time
review.

### Example 2

User says: `Watch this PR until the reviewer score is 5/5. If a comment is
unclear, ask for clarification instead of guessing.`

Actions:

1. watch the PR continuously
2. treat the explicit score as a gate
3. ask clarifying questions with options when feedback is ambiguous
4. keep iterating until the score reaches the top of the stated scale or a real
   blocker appears

Result: The loop keeps moving without guessing at reviewer intent.

## Troubleshooting

- If GitHub auth is missing, stop and report the exact missing capability.
- If multiple PRs could match the request, ask for the specific PR instead of
  watching the wrong branch.
- If the reviewer never answers a clarification question, keep the PR in
  blocked state and tell the user exactly which thread is waiting on input.
- If mergeability stays unknown, treat that as non-ready until better evidence
  appears.
