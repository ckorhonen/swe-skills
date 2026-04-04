# `swe:create-skill` Rubric

## Pass Conditions

- Defines concrete use cases and a clear workflow boundary before drafting the
  skill.
- Follows repo-specific authoring rules such as `swe:` names, matching eval
  assets, and required `SKILL.md` sections.
- Produces a frontmatter description with realistic trigger phrases and clear
  non-goals when needed.
- Treats validation and any required `README.md` or `AGENTS.md` updates as part
  of the authoring workflow.

## Fail Conditions

- Drafts a skill from an abstract capability label without concrete use cases.
- Ignores repo conventions for naming, file layout, or eval scaffolding.
- Writes a description that is too vague to trigger reliably or lacks scope
  controls where over-triggering is likely.
- Omits validation or pretends the package is complete without matching eval
  assets.

## Common Failure Modes

- Repeating generic skill-building advice without adapting it to this
  repository.
- Creating a skill body that is broader than the frontmatter trigger boundary.
- Forgetting to update `README.md` after adding a new skill.
- Treating eval assets as optional documentation instead of part of the
  contract.
