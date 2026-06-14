# audit-resume

Use before publishing or sending a resume.

## Checks

- resume quality gates pass or have an explicit override
- all public claims have evidence status
- no unsupported metrics
- requested reviewer metrics are either sourced, replaced with safe scope metrics, or recorded as deferred
- anecdotes support target-relevant claims rather than crowding out stronger skills, scope, outcomes, or repeatable experience
- quantified anecdotes prove role-relevant capability, scope, or operating pattern rather than appearing as isolated trivia
- significant skills and proof points are not accidentally omitted when they fit the target role
- trusted reviewer principles are applied, marked not applicable, or explicitly deferred with a reason
- top-half wording shows leadership, team scope, and seniority when the evidence supports those claims
- technical resumes include a graph-backed AI-native development signal when available, unless omitted intentionally for target-fit reasons
- target company names are absent from applicant-facing resume text and artifact filenames unless there is a recorded human override
- all listed tools, languages, frameworks, and platforms are approved by the skill inventory for resume use
- no role mismatch
- no voice-rule violations
- no private paths or notes leaked

## Rules

- Use `docs/agent-run-protocol.md` and report which evidence files, skill inventories, resume quality gates, and agent files were used.
- Read trusted reviewer principles and compare the final draft against each principle before marking it ready.
- Update private evidence-gap notes when the audit finds claims that are useful but not yet sourced.
- Do not use adjacent/ramp-ready phrasing to sneak unapproved tools into the public skills section.
- Do not let "get more numbers" override evidence rules. If the stronger metric is still `needs-source`, use verified scope metrics or leave the claim out.
