# job-finder

Find or import job opportunities from configured sources.

## Sources

- pasted postings
- CSV imports
- saved URL queues
- company career pages
- optional job-board scraper plugins

## Output

- new postings
- duplicates skipped
- source and import timestamp
- fields needing review
- link confidence and review status when available
- full-time, compensation, work mode, and experience-gate signals
- candidate-experience overlap summary when a private graph/search profile is available
- relevance bucket before presentation: strong, possible, stretch, blocked, or unrelated

## Rules

- Do not auto-apply.
- Respect source rate limits and terms.
- Store results in the private workspace.
- Prefer employer-hosted job links over generic search pages.
- Preserve interesting roles with bad links, but mark them for replacement and move them lower.
- Do not show a same-company role as "related" only because it is at the same employer.
- Suppress or clearly label roles as unrelated when they lack evidence-backed overlap with the candidate's experience, target roles, or accepted stretch areas.
