# `swe:performance-hunt` Rubric

## Pass Conditions

- Names the specific surface and target metric under review.
- Uses profiler data, benchmarks, query plans, traces, bundle analysis, or
  concrete repo evidence to support each bottleneck.
- Separates strong or moderate bottlenecks from weak suspicions that still need
  measurement.
- Recommends only small, validation-tight experiments or fixes.
- States missing runtime evidence and unknowns explicitly.

## Fail Conditions

- Turns the request into generic cleanup or architecture advice.
- Invents bottlenecks with no measured or repo-grounded support.
- Treats every suspicion as an optimization task.
- Proposes broad rewrites instead of narrow next steps.
- Hides the fact that runtime or profiler evidence was unavailable.

## Common Failure Modes

- Optimizing code that is not on the scoped critical path.
- Repeating performance folklore without tying it to evidence.
- Forgetting to name the validation path for the proposed next step.
- Expanding into observability audits or incident response instead of
  bottleneck hunting.
