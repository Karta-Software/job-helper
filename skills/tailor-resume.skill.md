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
7. Read any available claim-significance ranking.
   Use it to decide which true claims deserve limited resume space after target-role relevance and claim confidence are considered.
8. For technical roles, include at least one graph-backed AI-native development signal when available.
   Prefer outcomes such as agentic software delivery, AI-assisted testing/review, coding-agent orchestration, human-in-the-loop quality gates, prompt/workflow standards, or named tools such as Claude Code, Codex, and Cursor when the graph supports them.
9. Translate company/posting language into candidate-owned role language.
   Do not put the target company name in the resume body by default; say what the candidate has done that maps to the role.
10. Retarget the structure, not only the keywords.
   Change headline, summary, skill groups, bullet selection, bullet order, and domain framing when the target role calls for it.
11. Draft resume JSON or Markdown against the page, word, character, line, bullet, section, and style targets.
12. Apply `ResumeConstraints`.
13. Run `evidence-auditor`.
14. Run `voice-auditor`.
15. Remove fourth-wall guidance from applicant-facing files.
16. Save a new private resume version.
17. Render the resume to the configured private rendered-resume output with `render-resume-pdf`.
    Do not rely on the browser print dialog; it can add file URLs, dates, and page numbers as headers/footers.
18. Improve scanability with section contrast, role-block separation, selective proof-point bolding, and readable leading.
19. Name the final artifact by candidate and role, not target company, unless there is an explicit human override.
20. Run `run-resume-quality-gates`.
21. If any `error` gate fails, notify the mapped agent and rework the resume until it passes or reaches the configured iteration limit.
22. If it is approved for sending, save it to completed resumes and run `publish-resume`.

## Applicant-Facing Constraints

- Do not include "best target fit," "use this version," first-pass target lists, claim policies, ranking notes, or internal caveats.
- Do not include the target company name in the resume body or artifact filename by default.
  Keep company-specific strategy in private notes, not the public resume.
- Keep targeting guidance in a separate index, tracker note, or application plan.
- Keep claims evidence-backed.
- Do not overfit isolated anecdotes over stronger experience, skill, scope, or outcome signals.
- Use quantified anecdotes only when they prove a role-relevant capability, scope, or outcome better than a broader experience claim.
- Do not treat every true skill as equally important; use claim significance to decide what gets space.
- Frame adjacent experience honestly.
- Remove do-not-claim skills.
- Do not present AI tooling as a generic buzzword list; connect Claude Code, Codex, Cursor, or agent workflows to delivery, quality, review, testing, or developer productivity outcomes.
- Respect max page count.
- Prefer ATS-safe formatting unless the target role calls for a designed resume.
