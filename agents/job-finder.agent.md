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

## Rules

- Do not auto-apply.
- Respect source rate limits and terms.
- Store results in the private workspace.
- Prefer employer-hosted job links over generic search pages.
- Preserve interesting roles with bad links, but mark them for replacement and move them lower.
