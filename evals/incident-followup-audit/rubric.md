# `swe:incident-followup-audit` Rubric

## Pass Conditions

- Anchors the audit to a specific incident, sev, or postmortem scope.
- Reviews follow-up categories such as tests, monitors, docs, owners, tickets,
  rollback learnings, and backlog.
- Distinguishes done, partial, missing, and unknown without overclaiming.
- Keeps the output focused on post-incident follow-through instead of root cause
  or live response.
- Produces a short ranked backlog when follow-up remains open.

## Fail Conditions

- Turns the task into live incident response or incident root-cause analysis.
- Claims follow-up completion without direct evidence.
- Collapses planned, partial, and completed work into one bucket.
- Returns a generic maintenance list with no incident anchor.

## Common Failure Modes

- Treating a postmortem mention as proof that a fix shipped.
- Inferring test or monitoring work from a ticket title alone.
- Drifting into blame, debugging, or system design unrelated to follow-up.
- Returning an oversized backlog instead of the smallest useful next steps.
