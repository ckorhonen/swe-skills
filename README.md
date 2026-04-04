# SWE Skills

AI skill files and eval suites for streamlining SWE workflows.

## Structure
- `skills/` stores skill definitions.
- `evals/` stores evaluation suites and fixtures.

## Conventions
- Prefix every skill identifier/name with `swe:`.
- Keep repo documentation aligned with the current install flow and file layout.

## Install

Use `npx skills install`.

## Skills

- `swe:capture-knowledge`: Investigates a repo and its docs to find important uncaptured patterns or decisions, drafts proposed agent knowledge entries, and pauses for review before saving.
- `swe:merged-pr-monitoring`: Reviews recently merged PRs, verifies deployment status, compares pre/post deploy production signals, and summarizes observable impact using any available monitoring stack.
- `swe:repo-introspection`: Inspects any repository and produces a concrete orientation report covering structure, tooling, entry points, active surfaces, and safe places to start work.
- `swe:refactor-opportunities`: Reviews a repository and returns a best-first shortlist of small, low-risk, high-leverage refactor tickets that are suitable for parallel execution.
- `swe:recent-commit-bug-hunt`: Scans recent commits in a scoped set of repositories, finds likely bugs using concrete repo evidence only, and proposes minimal remediation sessions.
- `swe:security-audit`: Splits a codebase into services or packages, audits each surface for vulnerabilities, outdated dependencies, and license issues, and compiles one evidence-backed report.

## Notes
- `AGENTS.md` defines repository rules for agent-driven changes.
- `CLAUDE.md` is a symlink to `AGENTS.md`.
