---
name: "swe:repo-introspection"
description: "Inspect any software repository and produce a concrete, evidence-backed orientation report covering structure, tooling, conventions, active surfaces, and safe entry points for follow-on work."
metadata:
  short-description: Map a repo before changing it
---

# SWE Repo Introspection

Use this skill when the user wants to understand an unfamiliar repository before making changes, delegating work, or planning follow-on tasks.

## Goal

Review the repository and produce a concise, concrete orientation report that helps an engineer or agent become productive quickly without guessing.

The report should explain how the repository is organized, how it is likely operated, where the important boundaries are, and which areas look safest to touch next.

## What To Optimize For

- Concrete evidence from the repository
- Fast orientation
- Clear mental model of the codebase
- Accurate identification of entry points and working surfaces
- Explicit unknowns instead of speculation

## Required Workflow

1. Inspect the repository root, major directories, and primary documentation.
2. Identify the main languages, frameworks, package managers, and build or runtime tooling.
3. Find likely entry points such as app starts, services, CLI commands, routes, workers, jobs, or library exports.
4. Map the major code surfaces and their responsibilities.
5. Identify test locations, validation commands, and any visible CI or automation surfaces.
6. Inspect recent commits when useful to understand active areas or likely ownership.
7. Summarize the safest and most relevant surfaces for follow-on work.

## Evidence Rules

- Ground the report in specific files, directories, configs, commands, or recent commits.
- Use direct repo evidence whenever possible.
- If something is inferred rather than directly observed, label it as an inference.
- If key information is missing, say so plainly.

## What To Look For

Focus on practical orientation details such as:

- Repository purpose
- Top-level directory responsibilities
- Main runtime entry points
- Build, test, lint, and typecheck commands
- Shared libraries or internal packages
- Configuration hubs
- Integration boundaries
- Generated code or machine-managed surfaces
- High-change or recently active areas
- Safe small-scope places to start editing

## Output Requirements

Provide a report with these sections:

1. Repository summary
2. Structure map
3. Tooling and validation
4. Entry points and boundaries
5. Active or important surfaces
6. Safe starting points
7. Unknowns or risks

For each major area you describe, include:

- Area / surface
- Relevant files or directories
- Responsibility
- Why it matters

For the "safe starting points" section, include:

- The area
- Why it is relatively safe to touch
- What kind of work is a good fit there

## Quality Bar

- Be concise but specific
- Prefer named files and directories over generic descriptions
- Distinguish facts from inferences
- Do not pretend to understand hidden architecture that is not visible in the repo
- Make the report useful for immediate follow-on engineering work
