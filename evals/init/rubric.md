# `swe:init` Rubric

## Pass Conditions

- Distinguishes agent-collaboration init from project or package bootstrap and
  redirects cleanly when the request is out of scope.
- Uses `.ai/swe.json` with minified omit-defaults JSON and keeps the built-in
  defaults implicit unless an override is needed.
- Applies the requested mode correctly, including zero-question quick mode and
  optional `.gitignore` updates only when explicitly requested.
- Protects existing preference files by reading them first and avoiding silent
  overwrite.
- States the precedence rule so later skills do not treat local preferences as
  stronger than explicit repo guidance.

## Fail Conditions

- Treats the request like `npm init`, dependency bootstrap, or environment
  setup instead of a local preference workflow.
- Writes a verbose, human-first, or default-expanded config instead of compact
  `.ai/swe.json`.
- Touches `.gitignore` without explicit user direction or ignores the entire
  `.ai/` directory without being asked.
- Silently replaces an existing valid or malformed preference file.
- Omits the precedence rule or implies that `.ai/swe.json` outranks explicit
  user instructions or repo guidance.

## Common Failure Modes

- Asking extra interview questions in quick mode instead of writing `{"v":1}`.
- Capturing vague personality traits instead of behavior-shaping execution
  preferences.
- Using a different filename such as `.ai/prefs.json` after the contract was
  fixed to `.ai/swe.json`.
- Treating all future skills as required to load the file even when the
  preference would not change behavior.
