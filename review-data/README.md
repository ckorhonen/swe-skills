# Review Data

## Purpose

This directory stores local JSON files for the review workflow.

## Layout

- `datasets/` contains generated review datasets.
- `judges/` contains local exported judge-calibration datasets derived from
  reviewed items.
- `results/` contains local saved annotations from the review app.

Prompt assets for producing or auditing those labels live in
`review-agents/`, not in this directory.

## Git Rules

- Generated dataset JSON files stay local by default.
- Exported judge dataset JSON files stay local by default.
- Saved result JSON files stay local by default.
- `.gitkeep` files preserve the directory structure in git.
