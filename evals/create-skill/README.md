# `swe:create-skill` Eval Set

## What This Covers

This eval set checks whether the skill:

- starts from concrete use cases before drafting a skill package
- follows this repository's `swe:` naming, file, and eval conventions
- creates a narrow trigger boundary with realistic positive and negative
  triggers
- treats matching eval assets and repo guidance updates as part of the skill
  authoring workflow

## Case Mix

- `create-skill-new-repo-local-skill`
- `create-skill-overtriggering-revision`
- `create-skill-external-guide-distillation`

## Review Workflow

1. Run the skill against one authoring request.
2. Render the packet with `npm run evals:packet -- create-skill`.
3. Review the response with binary pass/fail decisions.
4. Save structured review results if the output will be reused later.
