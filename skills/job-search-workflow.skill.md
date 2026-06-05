# job-search-workflow

Use when starting or refreshing a job search.

## Inputs

- private career graph
- target roles
- search profile or sliders
- source list
- dealbreakers
- salary and experience constraints

## Steps

1. Create or load a `JobSearchProfile`.
2. Collect jobs from employer pages, job boards, saved searches, recruiter pages, CSVs, and pasted postings.
3. Normalize postings into the job-posting schema.
4. Deduplicate by company, role, location, and URL.
5. Run link review for likely targets.
6. Extract listed and implied skills.
7. Compare skill requirements to the candidate graph.
8. Score roles using fit, interest, salary, location, experience, domain requirements, and link confidence.
9. Save a ranked tracker update in the private workspace.
10. Choose resume versions only after links and dealbreakers are reviewed.

## Rules

- Do not auto-apply.
- Prefer direct employer links over aggregators.
- Keep broken or confusing links visible but move them lower.
- Separate strong fit, possible fit, stretch, and blocked roles.
- Keep private candidate data out of the repo.
