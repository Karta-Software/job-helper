# tailor-resume

Use when creating a role-specific resume version.

## Steps

1. Read current resume standards from the configured private workspace.
2. Read target posting or role criteria.
3. Confirm the posting link is live or intentionally proceed from a saved posting.
4. Build or load the role's skill inventory.
5. Run `experience-finder`.
6. Build a claim/evidence mix before drafting.
   Prioritize durable skills, role-fit experience, ownership scope, and outcomes; use anecdotes as proof points rather than the resume's organizing structure.
7. Draft resume JSON or Markdown against the page, word, character, line, bullet, section, and style targets.
8. Apply `ResumeConstraints`.
9. Run `evidence-auditor`.
10. Run `voice-auditor`.
11. Remove fourth-wall guidance from applicant-facing files.
12. Save a new private resume version.
13. Render the resume to the configured private rendered-resume output with `render-resume-pdf`.
    Do not rely on the browser print dialog; it can add file URLs, dates, and page numbers as headers/footers.
14. Improve scanability with section contrast, role-block separation, selective proof-point bolding, and readable leading.
15. Run `run-resume-quality-gates`.
16. If any `error` gate fails, notify the mapped agent and rework the resume until it passes or reaches the configured iteration limit.
17. If it is approved for sending, save it to completed resumes and run `publish-resume`.

## Applicant-Facing Constraints

- Do not include "best target fit," "use this version," first-pass target lists, claim policies, ranking notes, or internal caveats.
- Keep targeting guidance in a separate index, tracker note, or application plan.
- Keep claims evidence-backed.
- Do not overfit isolated anecdotes over stronger experience, skill, scope, or outcome signals.
- Frame adjacent experience honestly.
- Remove do-not-claim skills.
- Respect max page count.
- Prefer ATS-safe formatting unless the target role calls for a designed resume.
