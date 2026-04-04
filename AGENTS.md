# SWE Skills & Eval Suite

This repository stores AI skill files and evaluation suites for SWE workflows.

## Repository scope
- `skills/` contains skill definitions.
- `evals/` contains evaluation suites and fixtures.
- `README.md` is the primary overview and usage guide for the repository.

## Naming convention
- Every skill identifier/name must be prefixed with `swe:`.
- Avoid creating new skill names that do not start with `swe:`.

## Installation
- Install skills with `npx skills install`.
- Document install examples using `npx skills install`, not alternate commands.

## Workflow notes
- Keep additions narrowly scoped.
- Keep files small and reviewable.
- Co-locate related skill and eval assets in their feature directories.
- Update `README.md` whenever repository structure, install flow, or skill/eval workflows change.
- Do not land changes that make `README.md` materially inaccurate.
