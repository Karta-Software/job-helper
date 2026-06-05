# vet-job-links

Use when reviewing job links before prioritizing applications.

## Steps

1. Open the tracked URL.
2. Confirm the page loads.
3. Confirm the company and role title match the tracker.
4. Confirm the job appears available, not expired or removed.
5. Note redirects, login walls, paywalls, generic search pages, or mismatched results.
6. Prefer replacing aggregator links with direct employer links.
7. Save a `JobLinkReview`.
8. Move broken, unavailable, expired, confusing, or generic-search links lower in the review queue.

## Status Labels

- `live`: specific job page is usable.
- `broken`: URL fails to load.
- `unavailable`: role is missing or no longer accepting applications.
- `expired`: posting explicitly expired.
- `confusing`: page does not clearly match the tracked role.
- `generic-search`: link lands on a search page rather than a specific job.
- `login-required`: cannot verify without authentication.
- `duplicate`: same role is already tracked.

## Rules

- Do not delete interesting roles only because the first link is bad.
- Do mark them as needing a replacement link.
- Do not treat a generic search page as an application-ready posting.
