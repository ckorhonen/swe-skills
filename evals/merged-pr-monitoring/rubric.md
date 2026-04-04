# `swe:merged-pr-monitoring` Rubric

## Pass Conditions

- Names the merged PR set and uses merge timestamps to anchor the analysis.
- Confirms deployment with concrete evidence before claiming production impact.
- Keeps impact statements proportional to the available signals.
- Marks unknown deployment status or inconclusive metrics clearly.

## Fail Conditions

- Talks about production impact without confirming deployment.
- Reports generic monitoring commentary not tied to specific PRs.
- Claims causality from a single noisy metric with no caution.
- Omits the evidence source for deploy or production claims.

## Common Failure Modes

- Treating merged as deployed.
- Mixing PR summary with production impact and losing the connection.
- Ignoring contradictory sources instead of calling them out.
- Skipping the no-impact outcome when metrics show no meaningful change.
