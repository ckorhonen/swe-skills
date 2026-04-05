# Review Agent Prompts

This directory stores reusable prompt assets for agents that produce or audit
labels in the local eval review workflow.

These prompts are distinct from the draft evaluators under `judges/`:

- `judges/` contains subjective LLM-as-judge prompts meant to be calibrated
  against human labels.
- `review-agents/` contains operator prompts for creating and validating the
  human label set itself.

## Files

- `labeler-json.md`
  First-pass labeling prompt for agents that read dataset JSON and emit review
  JSON directly.
- `reviewer-json.md`
  Second-pass validation and correction prompt for agents that audit existing
  review JSON and return corrected results plus an audit trail.
- `labeler-web-ui.md`
  First-pass labeling prompt for agents that interact with the local browser
  review app started by `npm run review:serve`.
- `reviewer-web-ui.md`
  Second-pass audit prompt for agents that verify and fix labels through the
  browser review app.

## Important Constraint

The `reference` block in generated review datasets is a weak smoke-test aid,
not the source of truth. Agents should make an independent judgment from the
item content first and only use the reference section as a post-hoc sanity
check when needed.
