---
name: "swe:merged-pr-monitoring"
description: "Review recently merged pull requests, verify production deployment status, compare pre- and post-deploy signals, and summarize observable production impact using any available deployment and observability tooling."
metadata:
  short-description: Monitor production impact of merged PRs
---

# SWE Merged PR Monitoring

Use this skill when the user wants a concise, evidence-backed report on the production impact of recently merged pull requests.

Example scope: review all PRs merged by `ckorhonen` to `ProjectOpenSea/os2-web` or `ProjectOpenSea/os2-core` in the last 24 hours, or since last Friday if today is Monday.

## Goal

For each merged PR in scope:

- Identify the PR and merge time
- Determine which services, endpoints, or code paths are likely affected
- Confirm whether the change deployed to production
- Compare pre- vs post-deploy production signals
- Detect regressions or improvements
- Correlate any observed changes back to the modified code paths
- Produce a short, signal-focused report

## Tooling Stance

This skill is tool agnostic.

Use whichever deployment and observability sources are available, such as:

- Datadog
- Grafana
- CloudWatch
- Prometheus
- Internal deploy dashboards
- Release logs
- CI/CD systems
- Service-specific metrics or tracing tools

Prefer the source that gives the strongest direct evidence. If multiple sources are available, cross-check them when practical.

## Scope Rules

- Respect the exact repositories, author, and timeframe requested by the user.
- If the user defines a conditional timeframe such as "last 24 hours, or since last Friday if today is Monday," apply it exactly.
- Stay within the named repositories or services.
- If scope is missing, ask for the repo set, author filter, and time window before proceeding.

## Evidence Rules

- Use concrete evidence only.
- Anchor findings in PR metadata, merge timestamps, deploy records, changed files, service ownership, and observed production metrics.
- If production deployment cannot be confirmed, mark that clearly.
- If no measurable impact is visible, explicitly state: `No observable production impact.`
- Do not invent regressions, improvements, or root causes.

## Required Workflow

1. Collect all merged PRs in the requested scope.
2. For each PR, capture:
   - PR number
   - Title
   - Link
   - Merge time
3. Inspect changed files and diffs to infer the likely affected services, endpoints, jobs, or code paths.
4. Verify whether the PR deployed to production using available deploy or release evidence.
5. If deployed, identify the deploy time and environment.
6. Compare a window around the deployment, typically about 1-2 hours before vs after.
7. Review both broad system signals and local endpoint or service signals.
8. Correlate observed changes back to the touched code paths when evidence supports it.
9. If a PR was not deployed, mark it clearly and do not claim production impact.

## Metrics To Review

Negative impact detection:

- p50 / p95 / p99 latency changes
- Error rate changes
- Elevated 4xx / 5xx rates
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

## Root-Cause Alignment

When a measurable change exists:

- Map the change to the files, services, routes, handlers, jobs, or queries modified by the PR
- Explain why the observed signal is plausibly connected
- Keep the explanation short and evidence-led

When correlation is weak:

- Say the signal is inconclusive
- Do not over-attribute the change to the PR

## Output Requirements

Keep the report short, signal-focused, and one section per PR.

For each PR, include:

- PR number, title, and link
- Merge time
- Likely affected services or endpoints
- Deployed: `Yes` or `No`
- Deploy time and environment when available
- Impact summary:
  - Latency: `↑` / `↓` / `No change`
  - Error Rate: `↑` / `↓` / `No change`
  - System Load: `↑` / `↓` / `No change`
- Notes: one short explanation of any detected regression, improvement, or lack of observable impact

If not deployed, mark that clearly in the section.

If deployed but there is no measurable effect, say exactly: `No observable production impact.`

## Preferred Output Shape

Use this concise structure:

`PR #1234 — title`

`Deployed: Yes / No (time, environment when known)`

`Impact Summary`

- `Latency: ↑ / ↓ / No change`
- `Error Rate: ↑ / ↓ / No change`
- `System Load: ↑ / ↓ / No change`

`Notes:`

Short explanation of the most important signal, or `No observable production impact.`

## Quality Bar

- Be concise
- Use exact PRs, times, environments, services, and metric evidence when available
- Mark unknowns clearly
- Prefer no conclusion over a weak conclusion
- Keep each PR section independently readable
