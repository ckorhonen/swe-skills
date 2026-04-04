# `swe:docs-drift-audit` Rubric

## Pass Conditions

- Identifies the relevant change surface before comparing docs.
- Checks human-facing or operational docs that should plausibly reflect the
  change.
- Grounds every drift finding in concrete evidence from code, config, workflows,
  or recent history.
- Avoids agent-guidance updates, style-only rewrites, and speculation.
- Ranks findings by operational importance and recommends the smallest fix.

## Fail Conditions

- Treats generic documentation quality as drift without evidence of staleness.
- Drifts into updating `AGENTS.md`, `CLAUDE.md`, or other agent-facing guidance.
- Invents documentation gaps that are not tied to the inspected change surface.
- Returns a broad rewrite plan instead of a narrow evidence-backed edit queue.

## Common Failure Modes

- Flagging stale docs without naming the changed code or workflow surface.
- Confusing missing docs with stale docs and mixing them together.
- Including cosmetic mismatches that do not materially affect correctness or
  operations.
- Recommending unrelated documentation cleanup beyond the observed drift.
