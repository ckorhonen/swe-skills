# `swe:init` Eval Set

## What This Covers

This eval set checks whether the skill:

- creates or preserves the `.ai/swe.json` preference layer without drifting
  into project bootstrap
- uses the compact omit-defaults JSON contract and the approved quick-mode
  behavior
- keeps the file local-first without silently overriding existing state

## Case Mix

- `init-interview-local-preferences`
- `init-quick-defaults-no-gitignore`
- `init-existing-file-protection`
- `init-non-trigger-project-bootstrap`

## Review Workflow

1. Run the skill against one repository scope.
2. Render the packet with `npm run evals:packet -- init`.
3. Review the response with binary pass/fail decisions.
4. Save structured review results if the output will be reused later.
