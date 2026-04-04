---
name: "swe:capture-knowledge"
description: "Investigate a codebase and its documentation to identify important patterns, conventions, and architectural decisions that are not yet captured in agent rules or skills, then draft entries for review before saving."
metadata:
  short-description: Draft missing repo knowledge for agent review
---

# SWE Capture Knowledge

Use this skill when the user wants to extract important implicit knowledge from a repository and turn it into reusable agent guidance.

## Goal

Investigate the codebase and documentation to identify the most important patterns, conventions, and architectural decisions that are not yet captured in agent rules, skills, or other agent-facing guidance.

Draft the missing entries, present them for user review, and do not save anything until the user explicitly approves.

## What To Optimize For

- High-signal knowledge that will help future agents
- Concrete evidence from code and docs
- Gaps between actual practice and existing agent guidance
- Small set of impactful entries rather than exhaustive capture
- Explicit review before any write

## Hard Constraint

Do not save proposed entries automatically.

Always:

1. Investigate
2. Draft candidate entries
3. Ask the user to review
4. Save only after explicit approval

## Required Workflow

1. Inspect the repository structure and key documentation.
2. Read the existing agent guidance in scope, such as:
   - Agent rules
   - Existing skills
   - Workflow docs
   - Repository guidance files
3. Inspect implementation patterns in the codebase to understand how the system is actually built and maintained.
4. Identify important conventions or decisions that appear repeatedly but are not already captured in agent-facing guidance.
5. Prioritize only the most impactful missing knowledge.
6. Draft candidate entries with evidence and a proposed destination.
7. Present the entries to the user for review before saving.
8. Only after approval, write the accepted entries to the appropriate files.

## What To Look For

Focus on knowledge such as:

- Architectural boundaries
- Service ownership patterns
- Naming conventions
- File placement conventions
- Dependency or package management norms
- Testing expectations
- Deployment or release conventions
- Common extension points
- Repeated implementation patterns
- Local rules that differ from framework defaults

Avoid:

- Generic advice that would apply to any repository
- Low-value trivia
- One-off exceptions unless they are operationally important
- Broad restatements of documentation already captured in rules or skills

## Gap Analysis Rule

Do not just summarize the repo.

Instead:

- Compare observed reality in the codebase and docs to what is already captured in agent rules or skills
- Identify the missing knowledge that would most improve future agent behavior
- Explain why each proposed entry is missing today

## Evidence Rules

- Ground every proposed entry in concrete repository evidence
- Cite the files, directories, docs, configs, or code patterns that support the entry
- Distinguish observed facts from inferred conventions
- If an item is uncertain, present it as a candidate for confirmation rather than a rule

## Output Requirements

Produce a review packet with these sections:

1. Existing guidance reviewed
2. Candidate knowledge gaps
3. Proposed entries for review
4. Suggested save targets

For each proposed entry, include:

- Title
- Type: `pattern`, `convention`, or `architectural-decision`
- Why it matters
- Evidence
- Proposed entry text
- Suggested destination
- Confidence

## Save Targets

When suggesting where an approved entry should go, choose the narrowest appropriate target:

- Agent rules
- A specific skill
- A new skill
- Repository documentation
- Another agent-facing guidance file

Explain why that destination is the right place.

## Review Step

Before writing any files, ask the user to review the proposed entries.

If the user approves only a subset:

- Save only the approved subset
- Leave the rest unchanged

If the user requests edits:

- Revise the entries first
- Re-present them for review

## Quality Bar

- Prefer 3-7 strong entries over a long weak list
- Keep entries concrete and reusable
- Capture repo-specific behavior, not generic engineering advice
- Make the review packet easy to approve or reject item by item
