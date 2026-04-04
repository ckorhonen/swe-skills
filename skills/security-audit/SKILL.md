---
name: "swe:security-audit"
description: >-
  Audits a repository, workspace, or monorepo for dependency vulnerabilities,
  outdated security-sensitive packages, license issues, and dependency hygiene
  gaps, then compiles one evidence-backed report. Use when a user says `run a
  security audit`, `check dependencies and licenses`, `audit this monorepo for
  vulnerable packages`, or asks for a package-level security review. Do NOT use
  for a general secure-code review, threat model, or speculative vulnerability
  hunt without manifests, lockfiles, or package surfaces to inspect.
compatibility: >-
  Requires manifests or lockfiles for the target repo and works best with
  ecosystem audit tools such as package-manager audit commands, `osv-scanner`,
  `trivy`, or license scanners.
metadata:
  short-description: Audit services and packages for security risk
---

# SWE Security Audit

## What This Skill Does

Use this skill to run a dependency- and package-surface-focused security audit
across a repository, workspace, or monorepo.

The primary job is to find evidence-backed issues in:

- Vulnerabilities
- Outdated dependencies with real security relevance
- License issues
- Dependency hygiene gaps that materially weaken auditability

## When To Use

Use this skill when the user wants to:

- Audit a repo or monorepo for vulnerable packages
- Check dependency freshness and license risk
- Review package surfaces service by service
- Produce one consolidated dependency-security report

## Do Not Use

Do not use this skill for:

- A broad application code review
- Threat modeling
- Hand-auditing runtime bugs unrelated to dependencies or manifests
- Guessing about security posture without manifests, lockfiles, or scanners

## Inputs To Confirm

Confirm or infer:

- Repo or package scope
- Whether the audit should include all services or only selected units
- Which package managers and ecosystems are present
- What scanners or audit tools are available locally

## Parallelization Rule

Create one session per service or package when the environment supports parallel
agent work.

- Run up to 10 sessions at a time
- Give each session a disjoint surface area
- Have each session return raw evidence, not just conclusions
- Compile the final report centrally after the sessions finish

If parallel sessions are unavailable, process the units in local batches and
keep the same report shape.

## Instructions

### Step 1: Identify Audit Units

Inspect the repository and group the codebase into the smallest practical
independent audit surfaces, such as:

- Services
- Apps
- Packages
- Libraries
- Deployable components

### Step 2: Detect Each Unit's Ecosystem

For every unit, determine the ecosystem and package manager in use so the
correct scanner or audit command can be chosen.

### Step 3: Run The Strongest Available Checks

Run the most appropriate security, dependency, and license checks for each
surface. Prefer the package manager and scanners already used by the repo.

## Tooling Stance

This skill is tool agnostic.

Use the strongest available tools for the detected ecosystem, such as:

- `npm audit`, `pnpm audit`, or `yarn audit`
- `cargo audit`
- `pip-audit`, `safety`, or `poetry show --outdated`
- `bundle audit` or `bundler outdated`
- `go list -m -u all` or `govulncheck`
- `osv-scanner`
- `trivy`
- `license_finder`
- Ecosystem-native outdated or advisory commands

Prefer the package manager and scanner already used by the repository. Do not
invent tooling if the environment already has a clear local pattern.

### Step 4: Capture Raw Evidence

Capture concrete evidence from:

- Tool output
- Lockfiles
- Manifests
- Advisory IDs
- CI signals

If a check cannot be run, say why and do not guess the result.

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

Do not turn the task into a broad code review unless the dependency issue
directly exposes a security concern.

## Findings Threshold

Report only findings that are grounded in evidence.

For outdated dependencies:

- Prioritize meaningful lag, not trivial patch drift
- Focus on packages with security relevance, high exposure, or obvious staleness

For license issues:

- Report concrete incompatible, unknown, or restricted licenses
- Note when license data is incomplete or unavailable

### Step 5: Aggregate And Rank Findings

Aggregate all findings into one report ranked by severity and confidence.

Call out units with no findings explicitly.

## Output Requirements

Produce one consolidated report with these sections:

1. Scope audited
2. Audit coverage
3. Findings by severity
4. Package or service summaries
5. Recommended next actions

For each finding, include:

- Severity
- Service or package
- Relevant manifest or lockfile
- Dependency or license item
- Current version or status
- Recommended upgrade, remediation, or policy action
- Evidence

For each audited unit, include:

- Unit name
- Ecosystem or package manager
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

## Examples

### Example 1

User says: `Run a security audit across this monorepo and tell me which package
dependencies need urgent attention.`

Actions:

1. Split the monorepo into package-sized audit units
2. Detect each unit's ecosystem and package manager
3. Run the strongest available audit and license checks
4. Aggregate the evidence into one severity-ranked report

Result: The user gets a consolidated dependency-security report with clear next
actions.

### Example 2

User says: `Check this service for vulnerable or badly outdated dependencies and
flag any license problems.`

Actions:

1. Inspect the target service's manifests and lockfiles
2. Run the relevant ecosystem-native scanners
3. Report only evidence-backed findings
4. Note explicitly if some checks could not run

Result: The audit stays scoped to one service and avoids unsupported claims.

## Troubleshooting

### Problem: Lockfiles Or Manifests Are Missing

Call that out as a dependency-hygiene finding when appropriate and explain which
checks were blocked as a result.

### Problem: The Best Scanner Is Not Installed

Use the strongest available alternative, but say exactly which preferred check
could not run and how that limits confidence.

### Problem: Mixed Ecosystems Make Coverage Uneven

Report coverage per audit unit so the user can see which surfaces were fully
audited and which ones had partial visibility.

## Quality Bar

- Be evidence-led
- Prefer exact package names, versions, manifests, and advisories
- Use parallel sessions only where write and read scope are cleanly separated
- Keep the aggregation tight and non-redundant
- If the audit surface is too large or partially inaccessible, say so clearly
