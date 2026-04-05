# Review Data

## Purpose

This directory stores local JSON files for the review workflow.

## Layout

- `datasets/` contains generated review datasets.
- `judges/` contains local exported judge-calibration datasets derived from
  reviewed items.
- `results/` contains local saved annotations from the review app.
- Aggregate labels saved under `results/all-skills.synthetic.json` can be fanned
  back out to the per-skill result files with `npm run review:sync-results`.

Prompt assets for producing or auditing those labels live in
`review-agents/`, not in this directory.

## Git Rules

- Generated dataset JSON files stay local by default.
- Exported judge dataset JSON files stay local by default.
- Saved result JSON files stay local by default.
- `.gitkeep` files preserve the directory structure in git.
