# Eval Fixture Realism And Judge Calibration Plan

## Goal

Make eval cases exercise realistic repo conditions instead of pointing every
case at this repository, and finish calibrating the two draft judges that are
still bootstrap-only.

## Problem

Every case in `evals/*/cases.json` hardwires `context.repo_path` to `.`, so
several scenarios are synthetic against this docs-heavy repository:

- `security-audit-full-package-surface` runs against a near-empty dependency
  tree, so the happy path exercises clean-report handling rather than real
  finding-ranking.
- `ownership-risk-map` and `repo-introspection` cases describe this repo's own
  layout, which couples the evals to the repo structure and gives low
  generalization signal.
- `recent-commit-bug-hunt-overbroad-scope` assumes a month of multi-author
  history this repo may not have.

Separately, `npm run review:coverage` reports the judge label pool as
synthetic-only and heavily Fail-skewed (for example instruction-adherence at
10 Pass / 232 Fail). Only the scope-discipline judge is calibration-ready;
actionability needs roughly 11 more Pass labels and evidence-grounding
roughly 5.

## Plan

### Phase 1: Fixture Repos

1. Add `evals/fixtures/<fixture-slug>/` mini-repos, each a few dozen files:
   - `node-service`: a small Node package with a lockfile pinning at least
     one known-vulnerable dependency version, weak tests, and a stale README.
   - `multi-package`: two small packages with shared helpers, uneven test
     density, and a CODEOWNERS file with one orphaned path.
2. Extend `context.repo_path` usage so cases may point at
   `evals/fixtures/<fixture-slug>` instead of `.`. The case schema already
   permits any string; only `scripts/validate-evals.mjs` needs a check that
   the path exists.
3. Migrate the synthetic-against-this-repo cases listed above to fixtures.
   Keep meta-skill cases (`create-skill`, `init`, `repo-introspection`
   bounded case) on `.` where self-reference is the realistic scenario.

### Phase 2: Judge Calibration

1. Generate additional Pass-labeled examples: run the strongest skills
   against the fixtures, review manually in the review app, and label
   explicitly for the two starved criteria (actionable-output,
   concrete-evidence).
2. Re-run `npm run review:coverage` until actionability and
   evidence-grounding reach `ready`.
3. Only then promote the corresponding judges out of draft status, with a
   train/dev/test split per the existing `judges/` policy.

## Non-Goals

- No live-service fixtures or network-dependent scenarios.
- No LLM judges promoted before explicit human labels exist, per the
  existing eval framework policy.
- No change to the binary pass/fail review contract.

## Open Questions

- Whether fixture lockfiles with known-vulnerable pins should be excluded
  from repo-level dependency scanning noise (likely via scanner ignore
  config scoped to `evals/fixtures/`).
- Whether fixtures should carry their own git history (a scripted
  `git init` + synthetic commits step) so history-driven skills
  (ownership-risk-map, recent-commit-bug-hunt) get real signal.
