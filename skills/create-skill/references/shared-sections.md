# Shared Section Conventions

Canonical templates for the optional sections that several `swe:` skills
carry. When a skill needs one of these sections, start from the template
here and specialize only the domain-specific lists. Do not fork the framing
sentences — drift between copies is how contradictions creep in.

This file also records the description-style rules distilled from the
current Anthropic Agent Skills guidance and the OpenAI Codex skills
guidance, both of which now share the SKILL.md format under the Agent
Skills open standard.

## Frontmatter Description Style

- Write the description in third person; it is injected into the harness
  prompt verbatim.
- State what the skill does and when to use it, front-loading the concrete
  trigger phrases in the first sentence. Both Claude and Codex truncate
  long descriptions in skill listings, so the discriminating words must
  come first.
- Keep the description under 1,024 characters.
- Include at least one explicit non-goal whenever over-triggering is
  plausible.
- Add `compatibility` only when the skill has real environment
  requirements, and name the concrete tools it depends on (`gh`, `git`,
  `rg`, an MCP server) rather than abstract categories.

## Body Budget

- Keep `SKILL.md` under 500 lines. Move overflow into `references/` files
  split by domain, linked one level deep from `SKILL.md`, each with a table
  of contents once it passes roughly 100 lines.
- Only add context an agent does not already have. Prefer a short summary
  plus targeted lookup over inlined reference material.

## Portability Note

The Agent Skills open standard restricts `name` to lowercase letters,
digits, and hyphens. This repo's `swe:` prefix intentionally deviates for
namespacing; installers that enforce the standard strictly may normalize
the colon (for example to `swe-`). Keep folder names kebab-case without
the prefix so the packages stay installable either way.

## Tooling Stance Template

```markdown
## Tooling Stance

This skill is tool agnostic.

Use the strongest available evidence sources or commands for the detected
ecosystem, such as:

- <domain-specific tools or evidence sources>

Prefer the repository's own tooling and conventions over ad hoc commands.
If a needed system or tool is unavailable, say so explicitly instead of
inventing output.
```

Every skill whose `compatibility` note names tools should carry this
section listing them.

## Parallelization Rule Template

```markdown
## Parallelization Rule

Create one session per cleanly separated <unit> when the environment
supports parallel agent work.

- run only on disjoint surfaces
- cap concurrency at what the environment and user guidance allow
- give each session a bounded target
- have each session return raw evidence, not just conclusions
- keep prioritization, deduplication, and final ranking in the parent
  session

If parallel sessions are unavailable or surfaces overlap heavily, process
the same units serially in local batches and keep the same output shape.
```

Do not hardcode a session count; concurrency limits belong to the
environment and the user's own agent guidance, not the skill.

## Evidence Rules Template

```markdown
## Evidence Rules

- Tie every finding to concrete, named evidence.
- Separate observed facts from inferences, and label the inferences.
- If key information is missing or a source is unavailable, say so plainly
  instead of guessing.
- Do not invent tool output, metrics, owners, or history.
```

These restate the shared eval criteria `concrete-evidence` and
`honest-unknowns`; keeping the wording aligned keeps rubric review
consistent across skills.
