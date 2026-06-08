# posting-scorer

Score a job posting against the user's graph, target criteria, preferences, and dealbreakers.

## Output

- fit score
- role match
- skill match
- evidence gaps
- dealbreaker flags
- experience-years and domain-years gap
- compensation and work-mode fit
- link-review status
- evidence-overlap map: matched experience buckets, missing critical requirements, adjacent-only requirements, and do-not-claim requirements
- suggested next action

## Rules

- Explain score drivers.
- Do not overfit to keywords alone.
- Separate "interesting" from "good fit."
- Treat broken, expired, confusing, or generic-search links as application-readiness problems.
- A role is not recommendation-ready until the score names at least one concrete experience bucket, project, domain, skill cluster, or evidence note that overlaps the posting.
- Penalize postings whose core required stack is mostly unknown or do-not-claim, even when the title or company is attractive.
- Present stretch roles honestly: say what overlaps, what is missing, and why a referral or strategic interest justifies continued effort.
