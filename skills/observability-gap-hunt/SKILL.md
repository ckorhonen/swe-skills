---
name: "swe:observability-gap-hunt"
description: >-
  Inspects services, jobs, and code paths for missing or weak logs, metrics,
  traces, alerts, dashboards, or deployment-linked telemetry, then returns a
  tightly scoped backlog of observability gaps. Use when a user says `find
  observability gaps`, `audit telemetry coverage`, `what logs or metrics are
  missing`, `check alerting coverage`, or asks for a recurring telemetry review.
  Do NOT use for live incident response, root-cause analysis, generic
  performance tuning, or a broad code review.
compatibility: >-
  Requires a local repository checkout and works best with access to service
  configs, logging or metrics code, alert definitions, dashboard manifests,
  deploy manifests, or observability tooling configuration. When external
  telemetry systems are available, use them; otherwise work from repo evidence
  and state the limitation plainly.
metadata:
  short-description: Find missing logs, metrics, traces, and alerts
---

# SWE Observability Gap Hunt

## What This Skill Does

Use this skill to find observability blind spots in a repository and turn them
into a small, reviewable backlog.

The job is to identify where a service or code path lacks enough signal to be
operated confidently, then rank the smallest improvements that would materially
improve detection, diagnosis, or alerting.

This is not a performance tuning skill. The focus is telemetry coverage and
operational visibility.

## When To Use

Use this skill when the user wants to:

- audit logs, metrics, traces, alerts, or dashboards for gaps
- check whether important workflows are observable enough to operate safely
- find missing deployment-linked telemetry or runbook coverage
- run a recurring observability review over time

## Do Not Use

Do not use this skill for:

- live incident response or active root-cause analysis
- generic latency, throughput, or performance optimization
- broad application code review with no observability goal
- redesigning the entire monitoring stack
- replacing existing observability tooling without repository evidence

## Inputs To Confirm

Confirm or infer:

- repository, service, or package scope
- whether the user wants a report-only pass or a small backlog of follow-up
  work
- which observability systems are available locally or in connected tools
- whether recent incidents, deploys, or operational pain points matter
- any no-touch areas or known noisy surfaces

If scope is unclear, narrow it to the smallest service or package set that still
fits the request.

## Tooling Stance

This skill is tool agnostic.

Use the strongest available evidence sources, such as:

- application code and middleware
- logging helpers and structured log patterns
- metrics emitters, counters, timers, and labels
- tracing spans and context propagation
- alert rules and SLO definitions
- dashboard or panel configuration
- deploy manifests, release hooks, or health checks
- runbooks or operational docs tied to the service

If external telemetry systems are available, cross-check repo evidence against
them. If they are not available, say so and stay grounded in what the repo shows.

## Parallelization Rule

Create one session per cleanly separated service, package, or deployment unit
when the environment supports parallel work.

- run only on disjoint surfaces
- keep each session bounded to one service or package
- return raw evidence from each session, not just conclusions
- deduplicate and rank the final backlog centrally

If surfaces overlap heavily, keep the pass serial and smaller.

## Instructions

### Step 1: Identify The Audit Units

Split the repository into practical observability units, such as:

- services
- apps
- packages
- jobs or workers
- deployable components

Focus on units where missing telemetry would materially hurt detection or
diagnosis.

### Step 2: Map Critical Workflows And Failure Paths

For each unit, locate the paths that matter most operationally:

- request entry points
- background jobs
- retries and idempotency boundaries
- state transitions
- external integrations
- error handling and fallback paths

These are the places where missing telemetry is most costly.

### Step 3: Inspect Existing Observability Signals

Look for concrete evidence of:

- structured logs with useful fields
- metrics on the main success, latency, and failure paths
- traces or spans around important boundaries
- alerts or SLOs tied to the unit
- dashboards or panels that show the unit's health
- deploy or release checks that confirm the unit is live and healthy

Treat weak signal as a real gap if it would slow down diagnosis or hide
regressions.

### Step 4: Rank Blind Spots By Operational Value

Prioritize gaps that would most improve:

- detection of failures
- diagnosis speed
- alert quality
- operational confidence after deploys

Prefer gaps that are:

- small enough to implement in a focused follow-up
- local to one service or package
- easy to verify with targeted checks

### Step 5: Propose A Tight Backlog

Turn the strongest gaps into ticket-shaped recommendations.

Each item should include:

- the surface or workflow affected
- the evidence that observability is weak or missing
- the specific telemetry gap
- why it matters operationally
- the smallest practical follow-up
- any validation or rollout notes

Do not turn this into a redesign plan for the monitoring platform.

### Step 6: Call Out Unknowns Clearly

If telemetry systems, dashboards, or alerts are not accessible, say that
explicitly.

Distinguish between:

- directly observed gaps
- gaps inferred from repo evidence
- areas you could not verify

### Step 7: Leave A Repeatable Next Pass

If the repo has many units, leave a short backlog for the next scheduled pass
instead of trying to cover everything in one run.

## Output Requirements

Provide a report with these sections:

1. Scope audited
2. Observability signals reviewed
3. Ranked blind spots
4. Proposed follow-up backlog
5. Unknowns or limits

For each ranked gap, include:

- unit or surface
- evidence
- missing signal
- operational impact
- smallest recommended fix
- priority

If there are no material gaps, say so plainly and explain what coverage appears
adequate.

## Quality Bar

- Stay focused on telemetry coverage, not product performance tuning.
- Ground claims in concrete repo or tooling evidence.
- Prefer a small, high-value backlog over a broad monitoring wish list.
- Label unknowns and inferences honestly.
- Keep recommendations local, actionable, and easy to validate.
