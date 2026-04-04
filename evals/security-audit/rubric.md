# `swe:security-audit` Rubric

## Pass Conditions

- Identifies the audit units or package surfaces in scope.
- Uses the strongest available ecosystem checks rather than inventing a custom
  process.
- Captures raw evidence from scanners, manifests, or lockfiles.
- Reports real coverage gaps or missing tooling explicitly.

## Fail Conditions

- Claims security findings without concrete scanner or manifest evidence.
- Ignores the repository's actual package manager or ecosystem shape.
- Treats missing tooling as successful coverage.
- Slides into a general secure-code review instead of a dependency and package
  surface audit.

## Common Failure Modes

- Running weak or irrelevant checks while stronger native tooling is available.
- Mixing dependency findings with unrelated application-security advice.
- Forgetting to explain why a package or service grouping was chosen.
- Reporting incomplete coverage without saying what was skipped.
