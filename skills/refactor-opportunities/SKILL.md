---
name: "swe:refactor-opportunities"
description: "Review any software repository and identify a small set of narrow, low-risk, high-leverage refactor opportunities that can be executed independently by a swarm of agents."
metadata:
  short-description: Find small, parallelizable refactor tickets
---

# SWE Refactor Opportunities

Use this skill when the user wants a concrete shortlist of small refactors, not a broad cleanup plan.

## Goal

Review the repository and identify a small set of targeted refactor opportunities that can be completed as focused, low-risk tasks by multiple agents working in parallel.

This is not a general code health audit and not an architecture review.

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

## Required Workflow

1. Inspect the repository structure, relevant files, and local patterns before forming suggestions.
2. Look for repeated code paths, oversized local surfaces, dead branches, confusing conditionals, and duplicated transformations.
3. Check recent contribution history when possible so the recommendations can be matched to the user's likely context.
4. Filter aggressively. Only keep suggestions that are narrow enough to be assigned as focused tickets.
5. Rank the final list best-first by leverage, clarity, and likelihood of safe execution.

## Selection Criteria

Every suggestion must satisfy all of the following:

- Can be described as a single focused task
- Can likely be completed without changing product behavior
- Has a bounded surface area and obvious owner files
- Does not depend on a large prior cleanup
- Would still be worth doing even if only one or two of the suggestions are accepted

Prefer suggestions that are also:

- Good candidates for parallel work because the write scopes are mostly disjoint
- Easy to verify with targeted tests or local validation
- Close to areas the user has touched recently

## Output Requirements

Return 5-10 suggestions total. If the repository does not contain enough good candidates under these constraints, say so instead of forcing weak ideas.

Rank the suggestions best-first.

For each suggestion, include:

- Repo
- Area / surface
- Relevant file(s) or component(s)
- What looks off today
- The specific refactor to make
- Why this is a good small task
- Expected impact
- Risk level: `low` or `medium`
- Why it is a good fit for the user specifically, based on recent contributions

## Quality Bar

- Be concrete and opinionated
- Name files and components explicitly
- Keep each suggestion narrow enough to become an actionable ticket
- Do not pad the list with generic cleanup advice
- If a repo or area has no good candidates, say so plainly

## Response Shape

Use a numbered list. Each item should read like a ticket proposal, not a brainstorming note.

For the "good fit for the user" field:

- Use observed recent contributions when available
- If contribution history is unavailable, say that directly and make the fit assessment from the files or surfaces already under discussion
