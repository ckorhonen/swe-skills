# SWE Skills

AI skill files and eval suites for streamlining SWE workflows.

## Structure

- `skills/` stores skill definitions.
- `evals/` stores evaluation suites and fixtures.

## Conventions

- Prefix every skill identifier or name with `swe:`.
- Keep repo documentation aligned with the current install flow and file layout.

## Install

Use `npx skills install`.

## Development

- Run `npm install` to install repo-local lint tooling and set up the Git hook.
- Run `npm run lint:md` to check Markdown files.
- Run `npm run lint:md:fix` to apply Markdown fixes.
- Pre-commit runs `lint-staged`, which lints and auto-fixes staged Markdown
  files.

## Authoring Conventions

- Keep every skill name prefixed with `swe:` even though some generic external
  skill guides use unprefixed kebab-case examples.
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
- `swe:merged-pr-monitoring`: Reviews merged PRs, confirms production
  deployment, compares pre- and post-deploy signals, and summarizes observable
  production impact.
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

## Notes

- `AGENTS.md` defines repository rules for agent-driven changes.
- `CLAUDE.md` is a symlink to `AGENTS.md`.
