# `swe:refactor-opportunities` Rubric

## Pass Conditions

- Produces a short best-first backlog of narrow, low-risk refactor tickets.
- Gives clear write boundaries and a realistic validation path for each ticket.
- Avoids speculative architecture or style-only cleanup.
- Keeps each ticket independently executable.

## Fail Conditions

- Suggests broad redesigns or large file-splitting work.
- Mixes bug fixes into a refactor-only request.
- Gives vague advice that cannot be turned into a ticket immediately.
- Recommends cleanup with no evidence from the inspected repo surface.

## Common Failure Modes

- Calling a risky behavioral change a refactor.
- Proposing tickets that depend on a hidden precursor cleanup.
- Ignoring the request for contributor tailoring when history is available.
- Returning too many suggestions instead of a tight shortlist.
