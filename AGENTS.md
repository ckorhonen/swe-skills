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

- Install skills with `npx skills install ckorhonen/swe-skills`.
- Document install examples using `npx skills install ckorhonen/swe-skills`, not alternate commands.

## Marketing site (`site/`)

- `site/` contains the static marketing website deployed to `cdd.dev/skill/`.
- The site showcases all swe: skills with descriptions, example prompts,
  sample output, and suggested schedules.

### Site sync rules

- **Adding a skill**: Add a skill card to the appropriate category section
  in `site/index.html`. Include the skill name, one-line description, and an
  example prompt. Add it to the relevant schedule card in the Schedules
  section. Update the skill count in the hero lede, Framework section, and
  page title if the total changes.
- **Removing a skill**: Remove the skill card, its schedule entry, and adjust
  counts accordingly.
- **Modifying a skill**: After changing a skill's description, trigger
  conditions, or output format, review `site/index.html` for accuracy.
  Update the skill card description, example prompt, or sample output if
  they no longer reflect the skill's behavior.
- **Deploying changes**: After editing `site/`, deploy with
  `wrangler deploy --name swe-skills-site --assets site/ --compatibility-date 2024-12-01`
  from this repo root. The site is served by the `swe-skills-site` Cloudflare
  Worker (not the `cdd-site` Pages project). Verify with
  `curl -s https://cdd.dev/skill/ | grep -c data-reveal` or similar.

## Workflow notes

- Keep additions narrowly scoped.
- Keep files small and reviewable.
- Before creating or revising anything under `skills/` and the matching
  `evals/` assets, use `swe:create-skill` first. It contains the repo-local,
  distilled authoring guidance adapted from Anthropic's skill-building guide.
- Co-locate related skill and eval assets in their feature directories.
- Update `README.md` whenever repository structure, install flow, or skill/eval workflows change.
- Do not land changes that make `README.md` materially inaccurate.
- Do not land changes to skills without checking `site/index.html` for accuracy.
