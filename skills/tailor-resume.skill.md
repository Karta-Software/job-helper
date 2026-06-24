# tailor-resume

Use when creating a role-specific resume version.

## Steps

1. Follow `docs/agent-run-protocol.md` and record the run inputs, skills, agents, graph files, validations, commit status, and push status when feasible.
2. Read current resume standards from the configured private workspace.
3. Read resume quality gates, Resume Claim Weighting, Resume Evidence Backlog, Resume Finalization notes, Skill Inventory, Experience Domain Map, current resume/version notes, and the opportunity tracker when available.
4. Read configured candidate identity and application defaults before copying header, contact, or education lines.
   Do not infer degree type from old artifacts. If the default education wording is generic, keep it generic and configure `educationWording` to block stale degree labels.
5. Read target posting or role criteria.
6. Confirm the posting link is live or intentionally proceed from a saved posting.
7. Build or load the role's skill inventory.
8. Run `experience-finder` and use its evidence gaps before drafting.
9. Build or refresh an experience surface map for the strongest relevant employers/projects.
   Choose responsibility buckets and domain buckets before selecting anecdotes, metrics, or bullets.
10. Build a claim/evidence mix before drafting.
   Prioritize durable skills, role-fit experience, ownership scope, and outcomes; use anecdotes as proof points rather than the resume's organizing structure.
11. Read any available claim-significance ranking.
   Use it to decide which true claims deserve limited resume space after target-role relevance and claim confidence are considered.
12. Read any trusted reviewer principles or prior critique notes that apply to the role, source, or resume type.
   Build a principle application table before the draft is marked ready: `applied`, `partial`, `deferred`, or `not applicable`.
   Treat source-backed principles as workflow inputs, not optional comments.
13. For technical roles, include at least one graph-backed AI-native development signal when available.
   Prefer outcomes such as agentic software delivery, AI-assisted testing/review, coding-agent orchestration, human-in-the-loop quality gates, prompt/workflow standards, or named tools such as Claude Code, Codex, and Cursor when the graph supports them.
14. Translate company/posting language into candidate-owned role language.
   Do not put the target company name in the resume body by default; say what the candidate has done that maps to the role.
15. Retarget the structure, not only the keywords.
   Change headline, summary, skill groups, bullet selection, bullet order, and domain framing when the target role calls for it.
16. Draft resume JSON or Markdown against the page, word, character, line, bullet, section, and style targets.
17. Apply `ResumeConstraints`.
18. When outcome metrics are not sourced, prefer verified scope metrics such as years owned, peak team size, direct commit count, multi-author history, product surface, module/file scope, customer-facing delivery, or program participation.
19. Word team-led work as leadership when the candidate owned direction, scoping, review, mentoring, delivery, standards, or cross-functional coordination.
20. Run `evidence-auditor`.
21. Run `voice-auditor`.
22. Remove fourth-wall guidance from applicant-facing files.
23. Save a new private resume version.
24. Update the private resume version note, opportunity note, application tracker, and structured opportunities JSON.
25. Render the resume to the configured private rendered-resume output with `render-resume-pdf`.
    Do not rely on the browser print dialog; it can add file URLs, dates, and page numbers as headers/footers.
26. Improve scanability with section contrast, role-block separation, selective proof-point bolding, and readable leading.
27. Name the final artifact by candidate and role, not target company, unless there is an explicit human override.
28. Run `run-resume-quality-gates`.
29. If any `error` gate fails, notify the mapped agent and rework the resume until it passes or reaches the configured iteration limit.
30. If any required reviewer principle is `partial` or `deferred`, record the reason and route it to the mapped agent unless a human override is recorded.
31. If it is approved for sending, save it to completed resumes and run `publish-resume`.

## Applicant-Facing Constraints

- Do not include "best target fit," "use this version," first-pass target lists, claim policies, ranking notes, or internal caveats.
- Do not include the target company name in the resume body or artifact filename by default.
  Keep company-specific strategy in private notes, not the public resume.
- Keep targeting guidance in a separate index, tracker note, or application plan.
- Keep claims evidence-backed.
- Do not overfit isolated anecdotes over stronger experience, skill, scope, or outcome signals.
- Use quantified anecdotes only when they prove a role-relevant capability, scope, or outcome better than a broader experience claim.
- Do not use unsourced metrics to satisfy reviewer pressure for numbers. Use safe scope metrics until the stronger metric is sourced.
- Do not flatten leadership into individual-contributor wording when the evidence shows the candidate led direction, reviews, standards, delivery, mentoring, or coordination.
- Do not mark reviewer feedback as done unless the version note records what changed and what remained intentionally deferred.
- Do not treat every true skill as equally important; use claim significance to decide what gets space.
- Frame adjacent experience honestly.
- Do not use "ramp-ready," "adjacent," or similar wording to include a tool as a public skill claim unless the user has explicitly approved that tool for resume use.
- Remove do-not-claim skills.
- Do not present AI tooling as a generic buzzword list; connect Claude Code, Codex, Cursor, or agent workflows to delivery, quality, review, testing, or developer productivity outcomes.
- Respect max page count.
- Prefer ATS-safe formatting unless the target role calls for a designed resume.
- The final report must name the skill files, agent files, graph/workspace files, quality gates, and validation commands used.
