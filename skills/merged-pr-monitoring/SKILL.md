---
name: "swe:merged-pr-monitoring"
description: >-
  Reviews recently merged pull requests, confirms whether they reached
  production, compares pre- and post-deploy signals, and summarizes observable
  impact. Use when a user says `monitor merged PRs`, `did this deploy hurt
  prod`, `check production impact of yesterday's merges`, or asks for a
  post-deploy readout tied to merged GitHub PRs. Do NOT use for a pre-merge
  code review, incident analysis with no PR scope, or generic dashboard triage
  disconnected from merged changes.
compatibility: >-
  Requires access to GitHub PR metadata plus deployment and observability
  sources such as CI or CD logs, release dashboards, metrics, traces, or
  service health tools.
metadata:
  short-description: Monitor production impact of merged PRs
---

# SWE Merged PR Monitoring

## What This Skill Does

Use this skill to connect merged code changes to production evidence without
guessing.

The expected output is a short, PR-by-PR report that answers:

- What merged
- Whether it deployed
- What likely changed in production
- What the observable impact was, if any

## When To Use

Use this skill when the user wants to:

- Review the production impact of recent merged PRs
- Check whether a change reached production and moved metrics
- Compare pre- and post-deploy behavior for a scoped set of merges
- Produce a concise engineering readout tied to merged GitHub work

## Do Not Use

Do not use this skill for:

- Pre-merge code review
- Root-cause analysis with no scoped PR set
- Generic service monitoring not tied to merged changes
- Product analytics reporting unrelated to deploys

## Inputs To Confirm

Confirm or infer:

- Repository or service scope
- Author filter, if any
- Time window
- Production environment or environments to check
- Available deployment and observability sources

If the request leaves scope ambiguous, ask for the repo set, author filter, and
time window before proceeding.

## Tooling Stance

This skill is tool agnostic.

Use whichever deployment and observability sources are available, such as:

- Datadog
- Grafana
- CloudWatch
- Prometheus
- Internal deploy dashboards
- Release logs
- CI or CD systems
- Service-specific metrics or tracing tools

Prefer the source that gives the strongest direct evidence. If multiple sources
are available, cross-check them when practical.

## Instructions

### Step 1: Define Scope Precisely

Respect the exact repositories, author filters, and timeframe requested by the
user.

If the user defines a conditional timeframe such as `last 24 hours, or since
last Friday if today is Monday`, apply it exactly.

### Step 2: Collect The Merged PR Set

For each PR in scope, capture:

- PR number
- Title
- Link
- Merge time

Do not skip the merge timestamp. It anchors the later deployment comparison.

### Step 3: Map Likely Affected Surfaces

Inspect changed files and diffs to infer the likely affected services,
endpoints, handlers, jobs, or code paths.

Keep this mapping concrete and short. Name the touched surfaces directly.

### Step 4: Confirm Production Deployment

Use deploy logs, release dashboards, CI or CD records, or service-specific
release evidence to determine whether each PR reached production.

If deployment cannot be confirmed, mark that clearly and stop short of claiming
production impact.

### Step 5: Compare The Before And After Window

For deployed changes, compare a narrow window around the deployment, usually
about 1-2 hours before versus after.

Review both:

- Broad system signals
- Local signals tied to the touched endpoints or services

### Step 6: Correlate Cautiously

Only connect a metric change back to the PR when the evidence supports it.

If correlation is weak:

- Say the signal is inconclusive
- Do not over-attribute the change

### Step 7: Write A Short PR-By-PR Report

Each PR section should stand alone and clearly say whether the change deployed
and what, if anything, was observable in production.

## Metrics To Review

Negative impact detection:

- p50, p95, or p99 latency changes
- Error rate changes
- Elevated 4xx or 5xx rates
- Regressions on specific endpoints, jobs, or code paths

Positive impact detection:

- Latency improvements
- Reduced error rates
- Improved success rates
- Improved throughput

Downstream or system signals:

- CPU utilization
- Memory usage
- Service load
- Queue depth or worker backlog
- Database latency or query volume, if applicable

## Output Requirements

Keep the report short, signal-focused, and one section per PR.

For each PR, include:

- PR number, title, and link
- Merge time
- Likely affected services or endpoints
- Deployed: `Yes`, `No`, or `Unknown`
- Deploy time and environment when available
- Impact summary:
  - Latency: `Up`, `Down`, or `No change`
  - Error Rate: `Up`, `Down`, or `No change`
  - System Load: `Up`, `Down`, or `No change`
- Notes: one short explanation of any detected regression, improvement, or lack
  of observable impact

If deployed but there is no measurable effect, say exactly:
`No observable production impact.`

## Preferred Output Shape

Use this concise structure:

`PR #1234 - title`

`Deployed: Yes / No / Unknown (time, environment when known)`

`Impact Summary`

- `Latency: Up / Down / No change`
- `Error Rate: Up / Down / No change`
- `System Load: Up / Down / No change`

`Notes:`

Short explanation of the most important signal, or
`No observable production impact.`

## Examples

### Example 1

User says: `Check whether the PRs I merged into api-server yesterday caused any
production regressions.`

Actions:

1. Collect yesterday's merged PRs for the requested author and repo
2. Inspect diffs to identify affected endpoints and jobs
3. Confirm production deploy times
4. Compare pre- and post-deploy metrics
5. Report each PR separately

Result: The user gets a concise post-deploy readout tied directly to merged
changes.

### Example 2

User says: `Review all PRs merged to checkout-service since last Friday and tell
me whether any improved latency in prod.`

Actions:

1. Apply the exact timeframe
2. Confirm which PRs actually deployed
3. Compare latency and error signals around the deploy windows
4. Mark undeployed PRs separately

Result: The report distinguishes deployed versus undeployed PRs and calls out
only observable latency improvements backed by data.

## Troubleshooting

### Problem: Deployment Status Cannot Be Confirmed

Say `Deployed: Unknown` or `Deployed: No confirmed production evidence`, cite
what sources you checked, and do not claim production impact.

### Problem: Metrics Show No Meaningful Change

State `No observable production impact.` exactly. A null result is still a
useful outcome.

### Problem: Different Data Sources Disagree

Prefer the source with the most direct, timestamped evidence. If the conflict
cannot be resolved, note the disagreement explicitly instead of forcing a
single conclusion.

## Quality Bar

- Be concise
- Use exact PRs, times, environments, services, and metric evidence when available
- Mark unknowns clearly
- Prefer no conclusion over a weak conclusion
- Keep each PR section independently readable
