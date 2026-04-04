---
name: "swe:security-audit"
description: "Run a security, dependency freshness, and license audit across a codebase by splitting work per service or package, auditing in parallel batches, and compiling one evidence-backed report."
metadata:
  short-description: Audit services and packages for security risk
---

# SWE Security Audit

Use this skill when the user wants a security and dependency audit across a repository, workspace, or monorepo.

## Goal

Run a security audit across the codebase by splitting the work per service, app, library, or package, auditing those units in parallel, and compiling the results into a single report.

Focus on:

- Vulnerabilities
- Outdated dependencies
- License issues

## Parallelization Rule

Create one session per service or package when the environment supports parallel agent work.

- Run up to 10 sessions at a time
- Give each session a disjoint surface area
- Have each session return raw evidence, not just conclusions
- Compile the final report centrally after the sessions finish

If parallel sessions are unavailable, process the units in local batches and keep the same report shape.

## Required Workflow

1. Inspect the repository to identify audit units:
   - Services
   - Apps
   - Packages
   - Libraries
   - Deployable components
2. Group the codebase into the smallest practical independent audit surfaces.
3. For each surface, determine the ecosystem and package manager in use.
4. Run the most appropriate security, dependency, and license checks for that surface.
5. Capture concrete evidence from tool output, lockfiles, manifests, advisories, or CI signals.
6. Aggregate all findings into one report ranked by severity and confidence.
7. Call out units with no findings explicitly.

## Tooling Stance

This skill is tool agnostic.

Use the strongest available tools for the detected ecosystem, such as:

- `npm audit`, `pnpm audit`, `yarn audit`
- `cargo audit`
- `pip-audit`, `safety`, `poetry show --outdated`
- `bundle audit`, `bundler outdated`
- `go list -m -u all`, `govulncheck`
- `osv-scanner`
- `trivy`
- `license_finder`
- Ecosystem-native outdated or advisory commands

Prefer the package manager and scanner already used by the repository. Do not invent tooling if the environment already has a clear local pattern.

## Evidence Rules

- Use concrete evidence only
- Cite the service or package audited
- Name the manifest or lockfile involved
- Include vulnerable or outdated package names and versions
- Include the source of the advisory or scanner output when available
- Distinguish observed findings from inferred risk

If a check cannot be run:

- Say why
- Note the missing tool, lockfile, or environment limitation
- Do not guess the result

## What To Check

For each audit unit, check:

- Known vulnerabilities in direct and transitive dependencies
- Outdated dependencies that are materially behind and plausibly risky
- License issues or policy mismatches
- Missing lockfiles or suspicious dependency hygiene gaps
- Existing CI or audit failures tied to dependency health

Do not turn the task into a broad code review unless the dependency issue directly exposes a security concern.

## Findings Threshold

Report only findings that are grounded in evidence.

For outdated dependencies:

- Prioritize meaningful lag, not trivial patch drift
- Focus on packages with security relevance, high exposure, or obvious staleness

For license issues:

- Report concrete incompatible, unknown, or restricted licenses
- Note when license data is incomplete or unavailable

## Output Requirements

Produce one consolidated report with these sections:

1. Scope audited
2. Audit coverage
3. Findings by severity
4. Package or service summaries
5. Recommended next actions

For each finding, include:

- Severity
- Service / package
- Relevant manifest or lockfile
- Dependency or license item
- Current version or status
- Recommended upgrade, remediation, or policy action
- Evidence

For each audited unit, include:

- Unit name
- Ecosystem / package manager
- Checks run
- Result summary

## Output Style

Keep the final report concise and operational.

Prefer short bullets grouped by severity:

- Critical
- High
- Medium
- Low
- No findings

Call out the highest-priority remediation items first.

## Quality Bar

- Be evidence-led
- Prefer exact package names, versions, manifests, and advisories
- Use parallel sessions only where write and read scope are cleanly separated
- Keep the aggregation tight and non-redundant
- If the audit surface is too large or partially inaccessible, say so clearly
