# build-skill-inventory

Use when comparing a job posting to a candidate graph.

## Steps

1. Extract skills explicitly listed in the posting.
2. Extract implied skills from responsibilities, outcomes, tools, and domain language.
3. Pull candidate skills and evidence from the graph.
4. Classify each skill:
   - direct: candidate has done it and can claim it.
   - adjacent: candidate has related experience and can frame it carefully.
   - do-not-claim: do not include it in applicant-facing materials.
   - unknown: ask the candidate.
5. Identify unlisted candidate strengths that would differentiate the application.
6. Write short clarification questions for unknown or high-risk skills.
7. Save a `SkillInventory`.

## Rules

- Do not turn adjacent experience into direct ownership.
- Do not add posting keywords without evidence.
- Keep "safe unlisted strengths" separate from "required listed skills."
- Use the inventory to drive resume bullets and interview prep.
