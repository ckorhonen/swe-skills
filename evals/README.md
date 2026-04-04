# Eval Framework

This repository uses a lightweight eval framework for `swe:` skills.

## Structure

- `evals/shared/criteria.json` defines shared binary review criteria.
- `evals/shared/case.schema.json` documents the expected shape of
  per-skill `cases.json` files.
- `evals/shared/review-result.schema.json` documents the expected shape of
  saved review results.
- `evals/<skill-slug>/README.md` explains what the eval set covers.
- `evals/<skill-slug>/rubric.md` defines skill-specific pass/fail guidance.
- `evals/<skill-slug>/cases.json` defines concrete review scenarios.

## Commands

- `npm run evals:check`
  Validates skill frontmatter, required skill sections, eval asset presence,
  shared criteria references, and per-case structure.
- `npm run evals:packet -- <skill-slug>`
  Renders a Markdown review packet for one skill to stdout.
- `npm run evals:packet -- <skill-slug> --out <path>`
  Writes the review packet to a file.

## Review Loop

1. Update a skill in `skills/<skill-slug>/SKILL.md`.
2. Update its eval assets in `evals/<skill-slug>/`.
3. Run `npm run evals:check`.
4. Execute the skill against one or more cases.
5. Render a packet with `npm run evals:packet -- <skill-slug>`.
6. Review the output using binary `Pass` or `Fail` decisions.
7. Save structured review results using
   `evals/shared/review-result.schema.json` when labeled results are needed.

## Design Constraints

- Keep binary pass/fail rubrics instead of scorecards.
- Prefer code checks for objective failures.
- Do not add LLM judges before there is labeled data to validate them.
- Keep eval assets co-located, reviewable, and easy to update when skill
  behavior changes.
