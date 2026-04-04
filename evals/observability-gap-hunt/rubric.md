# `swe:observability-gap-hunt` Rubric

## Pass Conditions

- Identifies observability units and the critical workflows that need signal.
- Uses concrete repo or tooling evidence to distinguish real gaps from weak
  guesses.
- Keeps the output focused on telemetry coverage and operational visibility.
- Produces a tight, ticket-shaped backlog with priority and validation notes.
- States unknowns or inaccessible telemetry sources explicitly.

## Fail Conditions

- Turns the request into generic performance tuning or root-cause analysis.
- Invents dashboards, alerts, or metrics that are not supported by evidence.
- Broadens into a monitoring-platform redesign or unrelated code review.
- Returns a vague list of ideas with no surface, evidence, or operational value.

## Common Failure Modes

- Calling every missing metric a high-priority issue without operational context.
- Overlooking logs, traces, or alerts because only code was inspected.
- Hiding the fact that external telemetry systems were unavailable.
- Producing a backlog that is too broad to execute in a small follow-up.
