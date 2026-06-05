# tailor-resume

Use when creating a role-specific resume version.

## Steps

1. Read current resume standards from the configured private workspace.
2. Read target posting or role criteria.
3. Confirm the posting link is live or intentionally proceed from a saved posting.
4. Build or load the role's skill inventory.
5. Run `experience-finder`.
6. Draft resume JSON or Markdown against the page, word, character, line, bullet, section, and style targets.
7. Apply `ResumeConstraints`.
8. Run `evidence-auditor`.
9. Run `voice-auditor`.
10. Remove fourth-wall guidance from applicant-facing files.
11. Save a new private resume version.
12. Render the resume to the configured private rendered-resume output with `render-resume-pdf`.
    Do not rely on the browser print dialog; it can add file URLs, dates, and page numbers as headers/footers.
13. Improve scanability with section contrast, role-block separation, selective proof-point bolding, and readable leading.
14. Run `run-resume-quality-gates`.
15. If any `error` gate fails, notify the mapped agent and rework the resume until it passes or reaches the configured iteration limit.
16. If it is approved for sending, save it to completed resumes and run `publish-resume`.

## Applicant-Facing Constraints

- Do not include "best target fit," "use this version," first-pass target lists, claim policies, ranking notes, or internal caveats.
- Keep targeting guidance in a separate index, tracker note, or application plan.
- Keep claims evidence-backed.
- Frame adjacent experience honestly.
- Remove do-not-claim skills.
- Respect max page count.
- Prefer ATS-safe formatting unless the target role calls for a designed resume.
