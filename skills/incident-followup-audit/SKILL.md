---
name: "swe:incident-followup-audit"
description: >-
  Audits post-incident engineering follow-through after a sev or incident to
  verify whether the durable follow-up happened: regression tests, monitors,
  docs, runbooks, ownership updates, tickets, rollback learnings, and remaining
  backlog. Use when a user asks whether incident follow-up is complete, what
  still needs to be done after a postmortem, or how to close the engineering
  loop. Do NOT use for live incident response, root-cause analysis, or a
  generic bug hunt unrelated to an incident.
compatibility: >-
  Requires a local repository checkout plus access to incident artifacts such
  as postmortems, issue trackers, pull requests, CI, docs, and observability or
  alerting systems when available. Works best when the incident has a clear
  identifier, timeline, or postmortem document to anchor the audit.
metadata:
  short-description: Audit post-incident engineering follow-through
---

# SWE Incident Follow-up Audit

## What This Skill Does

Use this skill to check whether the engineering work that should happen after an
incident actually happened.

The goal is not to explain the incident itself. The goal is to answer:

- What follow-up work is done
- What follow-up work is missing
- What follow-up work is still uncertain
- What remains in the smallest sensible backlog

The skill should stay evidence-led and conservative. If follow-up cannot be
proven, mark it as unknown rather than filling in the gap.

## When To Use

Use this skill when the user wants to:

- Audit postmortem follow-through after a sev or production incident
- Check whether regression tests, monitors, runbooks, or docs were added
- See whether ownership, tickets, or rollback learnings were captured
- Review what is still left to do before the incident can be considered fully
  closed

## Do Not Use

Do not use this skill for:

- Live incident response or war-room triage
- Root-cause analysis of the incident itself
- Generic code review or bug hunting with no incident context
- Broad cleanup work that is not tied to a concrete incident or postmortem

## Inputs To Confirm

Confirm or infer:

- The incident, sev, or postmortem identifier
- The affected service, repo, or time window
- Which source-of-truth artifacts exist
- Whether the user wants a report-only audit or a follow-up backlog
- Which environments or systems can be checked for evidence

If the incident scope is unclear, ask for the narrowest identifier needed to
anchor the audit.

## Tooling Stance

This skill is tool agnostic.

Use whichever sources provide the strongest direct evidence, such as:

- Postmortems or incident docs
- Issue trackers
- Pull requests and commit history
- CI and test results
- Monitoring, alerting, dashboards, or traces
- Runbooks or operational docs

Prefer direct evidence over inference. If a system is unavailable, say so
explicitly.

## Instructions

### Step 1: Define The Incident Scope

Anchor the audit in a specific incident or sev.

Capture:

- Incident identifier or postmortem
- Affected repo, service, or subsystem
- Time window for the incident and follow-up work
- Any explicitly named owners or teams

Do not expand scope beyond the named incident unless the user asks for a wider
follow-up audit.

### Step 2: Collect Source-of-Truth Evidence

Look for the concrete artifacts that should record the follow-up work:

- Postmortem or incident summary
- Follow-up tickets or action items
- PRs and commits
- Test additions or fixes
- Monitoring changes
- Runbook or documentation updates
- Ownership or on-call changes
- Rollback or guardrail updates

Treat these as separate evidence streams. Do not assume one implies the others.

### Step 3: Audit The Follow-up Categories

Check each category explicitly:

- Regression tests
- Monitoring or alerts
- Docs or runbooks
- Ownership or escalation changes
- Tickets or tracked follow-up items
- Rollback or guardrail improvements
- Remaining cleanup backlog

For each category, mark the status as:

- done
- partial
- missing
- unknown

Use `unknown` when the evidence is absent or inaccessible.

### Step 4: Judge Completion Conservatively

Do not treat a mention in a postmortem as completion.
Do not treat a ticket as completion without proof of implementation.
Do not treat absence of evidence as evidence of absence.

If the evidence is mixed, say so plainly and separate what is proven from what is
only planned.

### Step 5: Rank The Remaining Follow-up

If any work is still open, rank the backlog by:

- risk reduction
- confidence improvement
- dependency on other work
- breadth of impact

Keep the backlog small and actionable. The point is to close the loop, not to
generate a large maintenance queue.

### Step 6: Stay Out Of Incident Response

If the user starts asking for root cause, blame, or live debugging, stop the
audit boundary and redirect to a separate incident analysis workflow.

The output should remain a follow-up audit, even if the incident involved
technical failures.

## Output Requirements

Provide a report with these sections:

1. Incident scope
2. Evidence reviewed
3. Completed follow-up
4. Missing or partial follow-up
5. Ranked remaining backlog
6. Unknowns or access limits

For each category, include:

- Status
- Evidence
- Why it matters
- Confidence level

For each backlog item, include:

- Item
- Why it remains important
- Expected file or system surface
- Suggested next validation step

## Quality Bar

- Stay anchored to one incident or sev unless the user asks for more
- Use concrete evidence only
- Distinguish done, partial, missing, and unknown
- Keep the backlog small and operational
- Do not drift into root cause or incident response
- Be explicit when evidence is missing or inaccessible
