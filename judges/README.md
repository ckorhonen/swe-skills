# Draft Judges

This directory stores draft LLM-as-judge prompt assets for subjective eval
criteria.

## Current Scope

The initial draft judges cover cross-skill criteria that are difficult to check
with code alone:

- scope discipline
- evidence grounding
- actionability

## Important Constraint

These judges are **draft only**.

They are not yet calibrated because the repository does not have a real
human-labeled train/dev/test split for judge validation.

## Expected Path

1. Collect labels through the review app.
2. Create train/dev/test splits from real labeled examples.
3. Update each draft prompt with training examples only.
4. Run `validate-evaluator` before trusting any judge result.
