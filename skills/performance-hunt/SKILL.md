---
name: "swe:performance-hunt"
description: >-
  Hunts for concrete performance bottlenecks in a scoped repository surface
  using profiler output, benchmarks, query plans, traces, bundle analysis, or
  repo evidence, then returns the smallest high-value follow-up experiments or
  fixes. Use when a user says `find performance bottlenecks`, `why is this
  slow`, `profile this flow`, `hunt hot paths`, or asks for a recurring
  performance review. Do NOT use for live incident response, generic
  observability audits, speculative micro-optimization, or broad architecture
  rewrites with no bottleneck evidence.
compatibility: >-
  Requires a local repository checkout and works best with benchmark harnesses,
  profiler output, flamegraphs, query plans, frontend bundle reports, load-test
  results, or runtime metrics. If runtime evidence is missing, stay grounded in
  repo-visible signals, label inferences clearly, and propose the smallest
  measurement step needed to remove uncertainty.
metadata:
  short-description: Find real performance bottlenecks and next fixes
---

# SWE Performance Hunt

## What This Skill Does

Use this skill to identify performance bottlenecks conservatively and turn them
into a small, reviewable backlog.

The goal is to separate:

- measured bottlenecks
- high-confidence hotspots supported by repo evidence
- weak suspicions that do not yet justify optimization work

The output should be a ranked set of bottlenecks plus the smallest next
experiment or fix for each item that clears the evidence bar.

## When To Use

Use this skill when the user wants to:

- find performance bottlenecks in a service, job, page, query path, or repo
- understand why a specific flow is slow
- audit recent performance regressions with concrete evidence
- rank hot paths before starting optimization work
- run a recurring performance review over time

## Do Not Use

Do not use this skill for:

- live incident response or active outage triage
- generic observability coverage audits
- broad cleanup or refactor planning with no performance target
- speculative micro-optimization with no measured user or system impact
- architecture rewrites that are not justified by bottleneck evidence

## Inputs To Confirm

Confirm or infer:

- repository, service, or package scope
- target flow, workload, or endpoint
- primary metric of interest, such as latency, throughput, memory, startup, or
  bundle size
- available evidence sources such as profiles, traces, benchmarks, or query
  plans
- whether the user wants a report-only pass or a small optimization backlog
- any guardrails around risky changes or expensive tests

If the request is too broad, narrow it to one flow and one metric before doing
deep analysis.

## Evidence Sources

Strong evidence includes:

- profiler output or flamegraphs
- targeted benchmarks
- load-test results
- query plans or database timing data
- frontend bundle analysis or render timing output
- traces or metrics tied to the scoped flow
- recent regression data from CI or performance tests

Useful repo evidence includes:

- obviously expensive loops or repeated work on hot paths
- missing caches or invalidation patterns
- N+1 queries or repeated remote calls
- unnecessary serialization, parsing, or data copying
- oversized client bundles or repeated rerender triggers
- synchronization or locking patterns likely to throttle throughput

If runtime data is absent, use repo evidence carefully and label findings as
inferred until measured.

## Parallelization Rule

Use parallel work only for clearly disjoint surfaces, such as separate services,
pages, or jobs.

- keep each session on one performance surface
- avoid splitting shared libraries or overlapping hot paths across sessions
- return raw evidence from each session, not just conclusions
- rank the combined backlog centrally

If surfaces overlap heavily, keep the hunt serial and smaller.

## Instructions

### Step 1: Define The Performance Surface

Lock the scope to the smallest surface that matches the request, such as:

- one endpoint
- one background job
- one page load
- one query path
- one benchmark suite

Name the primary metric and why it matters.

### Step 2: Gather The Strongest Evidence First

Start from measured evidence when available.

Prefer:

- existing benchmark outputs
- profiler traces
- load-test artifacts
- query plans
- frontend performance reports

Do not lead with optimization folklore when stronger evidence exists.

### Step 3: Map The Critical Path

Trace the work that dominates the scoped flow:

- entry points
- repeated loops or render cycles
- database and network boundaries
- serialization and parsing work
- cache lookups and misses
- synchronous chokepoints

Identify where time, memory, or bytes are likely being spent.

### Step 4: Separate Bottlenecks From Suspicion

Bucket findings into:

- strong evidence: measured bottleneck or direct regression signal
- moderate evidence: repo-backed hotspot with clear likely impact
- weak evidence: plausible issue that still needs measurement

Only recommend fixes or experiments for strong and moderate findings.

### Step 5: Rank By User And System Impact

Prioritize bottlenecks that:

- materially affect the target metric
- sit on a critical or frequent path
- have a small, low-risk next step
- can be verified with narrow checks

Avoid broad rewrites when a smaller validation step would answer the question.

### Step 6: Propose Minimal Follow-Up Work

For each bottleneck that clears the bar, propose:

- the affected surface
- the evidence
- the likely cause
- the smallest practical experiment or fix
- the validation command, benchmark, or measurement to rerun

Prefer measurement-tight loops over broad optimization programs.

### Step 7: Call Out Unknowns

Be explicit about:

- missing runtime data
- surfaces you could not verify
- findings that are currently inferred rather than measured

If the data is too weak, say so and stop at the measurement plan.

## Output Requirements

Provide a report with these sections:

1. Scope and target metric
2. Evidence reviewed
3. Ranked bottlenecks
4. Weak-signal suspicions skipped
5. Proposed follow-up experiments or fixes
6. Unknowns or limits

For each ranked bottleneck, include:

- surface
- target metric or regression
- concrete evidence
- likely cause
- smallest next step
- validation path
- confidence

For each weak-signal item, include:

- surface
- what looked suspicious
- why the evidence is insufficient
- explicit no-fix decision

If there are no credible bottlenecks, say so plainly and explain what evidence
looked healthy.

## Quality Bar

- Stay tied to the scoped flow and metric.
- Prefer measured evidence over performance folklore.
- Distinguish observed bottlenecks from inferred hotspots honestly.
- Recommend the smallest validation-tight next step.
- Do not drift into generic cleanup, observability, or architecture work.
