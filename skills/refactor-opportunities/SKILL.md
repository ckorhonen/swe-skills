---
name: "swe:refactor-opportunities"
description: >-
  Reviews a repository and returns a short, best-first backlog of small,
  low-risk refactor tickets with clear write boundaries and validation paths.
  Use when a user says `find refactor opportunities`, `what small cleanup
  tickets should we hand to agents`, `give me parallelizable refactors`, or
  asks for narrow maintainability wins in an existing repo. Do NOT use for a
  broad architecture redesign, style-only cleanup sweep, or bug hunt focused on
  functional regressions.
compatibility: >-
  Requires a local repository checkout and works best with shell access plus
  recent git history when tailoring recommendations to a specific contributor.
metadata:
  short-description: Find small, parallelizable refactor tickets
---

# SWE Refactor Opportunities

## What This Skill Does

Use this skill to produce a concrete shortlist of small refactor tickets, not a
broad cleanup strategy.

Each recommendation should already look like a ticket someone could execute
without re-scoping it.

## When To Use

Use this skill when the user wants:

- A shortlist of narrow refactors
- Tickets that can be handed to multiple agents in parallel
- Low-risk maintainability improvements with bounded write surfaces
- Concrete suggestions rather than an open-ended cleanup brainstorm

## Do Not Use

Do not use this skill for:

- Architecture rewrites
- Broad modernization plans
- Style-only cleanup work
- Bug hunting for recent regressions

## Inputs To Confirm

Confirm or infer:

- Repository or package scope
- Whether the user wants suggestions tailored to a specific contributor
- Any no-touch areas
- Whether recent contribution history is available

## What To Optimize For

- Small scope
- Low behavioral risk
- Clear write boundaries
- High leverage for maintainability
- Concrete tickets that can be executed independently

Prefer refactors that:

- De-duplicate repeated logic into a small helper or local module
- Extract a cohesive piece from an oversized file without large-scale splitting
- Consolidate repeated validation, mapping, or error-handling patterns
- Remove dead, redundant, or obviously obsolete code
- Simplify a confusing conditional or awkward interface boundary
- Standardize a tiny repeated pattern inside one local area

Avoid:

- Giant refactors
- Architecture rewrites
- Large-scale file splitting
- Cross-repo cleanup campaigns
- Renames done only for style
- Suggestions that require deep domain knowledge in untouched areas
- Vague advice that cannot be turned into a ticket immediately

## Instructions

### Step 1: Inspect The Repository Before Suggesting Anything

Review the repository structure, relevant files, and local patterns before
forming suggestions.

### Step 2: Find Candidate Refactor Surfaces

Look for:

- Repeated code paths
- Oversized local surfaces
- Dead branches
- Confusing conditionals
- Duplicated transformations
- Tiny areas where behavior-preserving simplification is realistic

### Step 3: Filter Hard For Small, Safe Work

Only keep suggestions that are narrow enough to be assigned as focused tasks.

If a suggestion depends on a large precursor cleanup, drop it.

### Step 4: Tailor The List To The User When Possible

Check recent contribution history when available so the recommendations can be
matched to the user's likely context.

If contribution history is unavailable, say so directly and base the fit
assessment on the repo surfaces already under review.

### Step 5: Rank And Write Ticket-Shaped Suggestions

Rank the final list best-first by leverage, clarity, and likelihood of safe
execution.

## Selection Criteria

Every suggestion must satisfy all of the following:

- Can be described as a single focused task
- Can likely be completed without changing product behavior
- Has a bounded surface area and obvious owner files
- Does not depend on a large prior cleanup
- Would still be worth doing even if only one or two of the suggestions are
  accepted

Prefer suggestions that are also:

- Good candidates for parallel work because the write scopes are mostly disjoint
- Easy to verify with targeted tests or local validation
- Close to areas the user has touched recently

## Output Requirements

Return 5-10 suggestions total. If the repository does not contain enough good
candidates under these constraints, say so instead of forcing weak ideas.

Rank the suggestions best-first.

For each suggestion, include:

- Repo
- Area or surface
- Relevant files or components
- What looks off today
- The specific refactor to make
- Why this is a good small task
- Expected impact
- Risk level: `low` or `medium`
- Why it is a good fit for the user specifically, based on recent contributions

## Response Shape

Use a numbered list. Each item should read like a ticket proposal, not a
brainstorming note.

For the `good fit for the user` field:

- Use observed recent contributions when available
- If contribution history is unavailable, say that directly and make the fit
  assessment from the files or surfaces already under discussion

## Examples

### Example 1

User says: `Give me five low-risk refactor tickets in this repo that we can
parallelize across agents.`

Actions:

1. Inspect the repo and identify repeated local patterns
2. Filter for bounded, behavior-preserving work
3. Rank the suggestions by leverage and safety
4. Return numbered ticket proposals with explicit file surfaces

Result: The user gets a backlog of immediately assignable refactor tasks.

### Example 2

User says: `I touched the API adapters last week. Find the best small refactors
near the areas I already know.`

Actions:

1. Inspect recent contribution history when available
2. Bias the search toward nearby duplicated mappings or validation paths
3. Return only suggestions that stay within narrow write boundaries

Result: The recommendations are both low-risk and relevant to the user's
current context.

## Troubleshooting

### Problem: Most Opportunities Are Too Large Or Too Risky

Do not pad the list. Return fewer suggestions and explain that the remaining
ideas looked more like architecture work than small refactors.

### Problem: Contribution History Is Unavailable

State that directly. Keep the `good fit for the user` field grounded in the
surfaces already under discussion instead of inventing ownership.

### Problem: The Repo Mainly Needs Bug Fixes, Not Refactors

Say so plainly. If the strongest findings are behavior regressions rather than
maintainability wins, note that this repo may be a better fit for a bug-hunt
skill than a refactor pass.

## Quality Bar

- Be concrete and opinionated
- Name files and components explicitly
- Keep each suggestion narrow enough to become an actionable ticket
- Do not pad the list with generic cleanup advice
- If a repo or area has no good candidates, say so plainly
