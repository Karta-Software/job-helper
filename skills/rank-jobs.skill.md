# rank-jobs

Use after importing job postings or adding graph-backed opportunities.

## Steps

1. Deduplicate postings and opportunities.
2. Attach postings to existing opportunities when they represent the same lead.
2. Apply the active `JobSearchProfile` sliders and dealbreakers.
3. Review link status before treating a role as application-ready.
4. Score each posting against target criteria and private graph.
5. Separate fit from interest.
6. Penalize or move down broken, unavailable, confusing, or generic-search links.
7. Flag experience-year or domain-year requirements that exceed the candidate's constraints.
8. Run `network-finder` for referral paths.
9. Run company research for top roles.
10. Save recommendations, statuses, and next actions to the private tracker.

## Score Drivers

- role/function alignment
- location and work-mode fit
- salary and compensation confidence
- full-time/part-time signal
- experience-years fit
- required credentials or domain-years gap
- listed skills with evidence
- adjacent skills that can be framed carefully
- unlisted candidate differentiators
- link confidence

## Buckets

- `strong`: good apply target after resume tailoring.
- `possible`: plausible, but needs careful positioning.
- `stretch`: interesting, but has meaningful gaps.
- `blocked`: expired, dealbreaker, unsupported credential, or too many unrelated required years.
