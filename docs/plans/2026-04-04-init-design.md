# SWE Init Design

## Goal

Add a narrow `swe:init` skill that initializes repo-local agent collaboration
preferences without turning into project bootstrap.

The skill should:

- gather a short set of behavior-shaping preferences
- store them in a compact machine-readable file
- keep the file local-first by default
- give later `swe:` skills a safe optional preference layer to consult

## Why This Exists

This repository already defines reusable `swe:` workflows, but it does not yet
have a standard place to capture how a specific user wants agents to behave in
one repo.

That creates repeated friction around:

- how much autonomy to use
- how much planning to do before edits
- how broad a change should be
- how strong validation should be
- how much detail to include in the final report

Those settings are useful, but they should not be hardcoded into every skill or
treated as stronger than explicit repo guidance.

## Scope Boundary

`swe:init` is for agent collaboration preferences only.

It is explicitly not for:

- `npm init` or project scaffolding
- dependency or environment setup
- secret management
- broad team-policy authoring

This boundary matters because the slug `init` is broad enough to over-trigger
without strong non-goals.

## File Contract

The preferences file path is:

- `.ai/swe.json`

The file format is:

- minified JSON
- schema version `1`
- omit-defaults storage

The compact schema is:

- `v`
- `autonomy`
- `plan`
- `scope`
- `verify`
- `report`
- `alts`
- `paths`

The design intentionally avoids:

- Markdown or prose-heavy config
- YAML
- duplicated defaults
- cryptic positional arrays

Minified JSON with compact but legible keys is the best tradeoff for current
OpenAI and Anthropic models because it is small, reliable to parse, and does
not require a separate decoding legend in every consuming skill.

## Defaults

Built-in defaults stay in the skill logic rather than the file:

```json
{"v":1,"autonomy":"bounded","plan":"short","scope":"minimal","verify":"standard","report":"evidence","alts":"material","paths":[]}
```

That makes quick mode naturally resolve to:

```json
{"v":1}
```

## Entrypoints

### Full Mode

`swe:init`

Runs a short interview and writes only the non-default overrides.

### Quick Mode

`swe:init --quick`

Writes `{"v":1}` with zero interview.

### Quick Mode With Local-Only Ignore

`swe:init --quick --gitignore`

Writes `{"v":1}` and adds `.ai/swe.json` to `.gitignore` if missing.

Quick mode should not prompt unless an existing file blocks the write.

## Interview Shape

The interview stays narrow and asks only preferences that materially change
agent behavior:

1. autonomy
2. planning depth
3. scope style
4. validation posture
5. report style
6. alternatives policy
7. optional sensitive paths

The design intentionally omits soft personality questions and repo bootstrap
questions because they do not improve agent execution enough to justify their
token cost.

## Precedence Rule

Later skills should apply preferences in this order:

1. explicit user request
2. repository guidance such as `AGENTS.md` or `README.md`
3. `.ai/swe.json`
4. the skill's own defaults

This prevents the local file from becoming a hidden override layer that
conflicts with explicit repository rules.

## Safety Rules

- Never overwrite an existing `.ai/swe.json` silently
- Read existing state first
- If the file is malformed, surface the parse issue and ask before replacing it
- Update `.gitignore` only when explicitly requested
- Ignore only `.ai/swe.json` by default, not the whole `.ai/` directory

## Expected Repo Changes

The implementation should add:

- `skills/init/SKILL.md`
- `evals/init/README.md`
- `evals/init/rubric.md`
- `evals/init/cases.json`
- a small `README.md` update documenting the new skill and preference
  precedence

## Validation Plan

The implementation should pass:

- `npm run evals:check`
- `npm run lint:md`

The package should also be reviewed for trigger-boundary clarity because
`init` is a naturally broad word.
