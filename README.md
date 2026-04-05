# SWE Skills

AI skill files and eval suites for streamlining SWE workflows.

## Structure

- `skills/` stores skill definitions.
- `evals/` stores evaluation suites and fixtures.
- `judges/` stores draft LLM-as-judge prompt assets for subjective eval
  criteria.
- `review-app/` stores the zero-dependency browser review interface.
- `review-data/` stores local generated review datasets and saved review
  results.
- `scripts/` stores local repo utilities, including eval validation and
  review-packet rendering.
- `docs/plans/` stores design and implementation plans for substantive repo
  changes.

## Conventions

- Prefix every skill identifier or name with `swe:`.
- Keep repo documentation aligned with the current install flow and file layout.

## Install

Use `npx skills install ckorhonen/swe-skills`.

## Development

- Run `npm install` to install repo-local lint tooling and set up the Git hook.
- Run `npm run lint:md` to check Markdown files.
- Run `npm run lint:md:fix` to apply Markdown fixes.
- Run `npm run evals:check` to validate skill and eval asset structure.
- Run `npm run evals:packet -- <skill-slug>` to render a review packet for one
  skill.
- Run `npm run judges:check` to validate draft judge prompt assets.
- Run `npm run judges:build-datasets` to export explicit criterion-labeled
  examples for each draft judge from local review results.
- Run `npm run review:build-dataset` to generate local review datasets from the
  current eval cases.
- Run `npm run review:coverage` to inspect overall, criterion, and
  review-question label coverage plus judge-readiness gaps.
- Run `npm run review:serve` to start the zero-dependency local review server
  and open the browser UI manually if desired.
- Pre-commit runs `lint-staged`, which lints and auto-fixes staged Markdown
  files.

## Authoring Conventions

- Keep every skill name prefixed with `swe:` even though some generic external
  skill guides use unprefixed kebab-case examples.
- Use `swe:create-skill` before creating or revising anything under `skills/`
  and the matching `evals/` assets. It distills the Anthropic skill-building
  guide into this repo's local authoring workflow.
- If a skill consults `.ai/swe.json`, treat it as an optional local preference
  layer only. Explicit user requests and repo guidance such as `AGENTS.md`
  still outrank it.
- If a skill consults `.ai/swe.json`, name only the relevant keys for that
  skill and do not let the file remove required sections, lower the evidence
  bar, or widen the skill beyond its stated non-goals.
- Write frontmatter descriptions so they clearly state what the skill does, when
  to use it, and a few realistic trigger phrases.
- Include explicit non-goals or negative triggers so skills do not overfire.
- Prefer a consistent `SKILL.md` structure: what the skill does, when to use
  it, inputs to confirm, instructions, output requirements, examples, and
  troubleshooting.
- Add `compatibility` notes when a skill depends on local checkout access,
  GitHub metadata, observability tooling, or ecosystem-specific scanners.

## Skills

- `swe:capture-knowledge`: Finds repo conventions or architectural decisions
  missing from agent-facing guidance, drafts evidence-backed entries, and pauses
  for review before any write-back.
- `swe:change-validation-planner`: Turns a scoped diff into the narrowest
  trustworthy validation ladder, states what each step proves, and calls out
  what remains unverified.
- `swe:create-skill`: Distills Anthropic's skill-building guidance into this
  repo's local workflow for authoring or revising `swe:` skills and matching
  eval assets.
- `swe:docs-drift-audit`: Audits human-facing and operational docs for drift
  from code, config, interface, or workflow changes without turning into a
  broad documentation rewrite.
- `swe:init`: Creates or updates a local-first `.ai/swe.json` preference file
  that captures how agents should plan, scope, validate, and report work in
  one repository.
- `swe:incident-followup-audit`: Audits whether the engineering follow-up after
  an incident actually happened, including tests, monitors, docs, ownership,
  tickets, and the remaining backlog.
- `swe:merged-pr-monitoring`: Reviews merged PRs, confirms production
  deployment, compares pre- and post-deploy signals, and summarizes observable
  production impact.
- `swe:observability-gap-hunt`: Finds missing or weak logs, metrics, traces,
  alerts, dashboards, and deployment-linked telemetry, then returns a ranked
  backlog of observability blind spots.
- `swe:ownership-risk-map`: Maps bus-factor and ownership risk from repo
  evidence such as churn, CODEOWNERS coverage, test density, and orphaned or
  unclear-owner surfaces.
- `swe:performance-hunt`: Hunts for concrete performance bottlenecks using
  profiler output, benchmarks, traces, query plans, bundle analysis, or repo
  evidence, then returns the smallest high-value experiments or fixes.
- `swe:pr-risk-review`: Reviews open or draft pull requests for merge risk,
  focusing on missing validation, hidden coupling, rollout and rollback gaps,
  migrations, and feature-flag issues.
- `swe:repo-introspection`: Produces an evidence-backed repo orientation report
  covering structure, tooling, entry points, boundaries, and safe starting
  surfaces.
- `swe:refactor-opportunities`: Returns a best-first backlog of small, low-risk,
  high-leverage refactor tickets that can be executed independently.
- `swe:recent-commit-bug-hunt`: Scans recent commits in a scoped set of
  repositories, finds likely bugs using concrete repo evidence only, and
  proposes minimal remediation sessions.
- `swe:security-audit`: Splits a codebase into services or packages, audits each
  surface for vulnerabilities, outdated dependencies, and license issues, and
  compiles one evidence-backed report.
- `swe:test-gap-hunt`: Detects the local test ecosystem, ranks high-value
  coverage and weak-test gaps, and runs a bounded incremental pass that can be
  repeated or scheduled over time.

## Eval Framework

- Every skill should have a matching `evals/<skill-slug>/` directory.
- Each eval set should include `README.md`, `rubric.md`, and `cases.json`.
- Shared eval contracts live in `evals/shared/`.
- Use binary pass/fail review for behavior evals.
- Keep objective checks in code or validation scripts when possible.
- Do not rely on LLM judges before there is labeled data to validate them.

## Review Workflow

- `npm run review:build-dataset` generates local JSON review datasets under
  `review-data/datasets/`.
- `npm run review:coverage` shows which items still need explicit criterion or
  review-question labels.
- `npm run review:serve` starts a small local server for the browser review app.
- The review app saves annotations to local JSON files under
  `review-data/results/`.
- `npm run judges:build-datasets` exports explicit criterion-labeled examples to
  `review-data/judges/`.
- Generated review data files stay local by default and are ignored by git.

## Draft Judges

- Judge prompts in `judges/` are draft assets only.
- They are intended for subjective criteria such as scope discipline,
  evidence-grounding, and actionability.
- They are not validated and should not be treated as trusted evaluators until
  enough human-labeled review data exists to run a proper train/dev/test split.
- Overall Pass/Fail labels are useful, but judge calibration requires explicit
  criterion labels for the criterion each judge is meant to score.

## Notes

- `AGENTS.md` defines repository rules for agent-driven changes.
- `CLAUDE.md` is a symlink to `AGENTS.md`.
