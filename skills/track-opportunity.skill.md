# track-opportunity

Use when the user mentions a company, referral, recruiter lead, or role they may want to pursue.

## Steps

1. Create or update a graph note for the opportunity.
2. Link the company, referral contact, target criteria, current resume, and application tracker.
3. Capture posting URL, requisition id, deadline, location, remote eligibility, salary range, and referral status when available.
4. Add or update a record in `.career-toolkit/jobs/opportunities.json`.
5. Set the earliest accurate status.
6. Run `network-finder` when a referral path exists.
7. Run `posting-scorer` when a posting or role description exists.
8. Run `application-strategist` to recommend next action.

## Rules

- An opportunity can exist before a posting URL or exact role exists.
- Deadlines are first-class; if the posting closes soon, make the next action deadline-driven.
- Location fit is a hard gate for normal opportunities.
- A referred nonlocal opportunity can receive a fast draft while location flexibility is being confirmed; record `locationExceptionReason`.
- Use `ready-to-apply` after materials are completed but before submission.
- Do not invent referral contacts or relationship details.
- Keep private relationship details out of committed examples.
- Keep graph notes readable and tracker records machine-readable.
