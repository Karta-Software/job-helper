# tailor-resume

Use as the drafting stage inside `create-resume` when creating a role-specific resume version. If a user asks directly for a new, revised, targeted, or final resume, load `skills/create-resume.skill.md` first and obey its completion barrier.

## Steps

1. Follow `docs/agent-run-protocol.md` and record the run inputs, skills, agents, graph files, validations, commit status, and push status when feasible.
2. Read current resume standards from the configured private workspace.
3. Read resume quality gates, Resume Claim Weighting, Resume Evidence Backlog, Resume Finalization notes, Skill Inventory, Experience Domain Map, current resume/version notes, and the opportunity tracker when available.
4. Read configured candidate identity and application defaults before copying header, contact, or education lines.
   Do not infer degree type from old artifacts. If the default education wording is generic, keep it generic and configure `educationWording` to block stale degree labels.
   For senior, staff, principal, product-owner, or founder/operator resumes, omit `Relevant coursework` by default unless the posting explicitly asks for coursework, the resume has a real education-keyword gap that stronger experience cannot cover, or a human override records why it earns space.
5. Read target posting or role criteria.
6. Confirm the posting link is live or intentionally proceed from a saved posting.
7. Build or load the role's skill inventory.
   Classify each required and preferred skill as `supported`, `adjacent`, `project-only`, or `do-not-claim`, with evidence references. Do not let an ATS keyword target change that classification.
   For agent-platform, AI-platform, or agent-foundations roles, configure `agentPlatformEvidenceDepth`. Require at least four source-backed dimensions across deployment boundary, users/consumers, durable state/runtime, failure/idempotency, observability/evaluations, and scale/measured outcome.
8. Run `experience-finder` and use its evidence gaps before drafting.
9. Build or refresh an experience surface map for the strongest relevant employers/projects.
   Choose responsibility buckets and domain buckets before selecting anecdotes, metrics, or bullets.
10. Build a claim/evidence mix before drafting.
   Prioritize durable skills, role-fit experience, ownership scope, and outcomes; use anecdotes as proof points rather than the resume's organizing structure.
   When a founder/operator role is the primary recent experience, build a founder-scope-density mix: verified tenure and team scope near the top, at least three target-relevant dimensions across engineering/architecture, product, clients, team leadership, production/business operations, or commercial impact, and one defensible scale or business signal when available.
   Do not rely on `founder`, `co-founder`, or `CTO` as self-explanatory seniority. Translate the scope for the target role and keep company-level outcomes distinct from personal attribution.
   Treat founder experience as a conditional signal, not an automatic advantage. When founder/operator experience is the primary recent role, configure `founderSignalBalance` for the resume version and build the draft to pass `founderTargetRoleTranslation`, `founderOperatingProof`, `founderCollaboration`, `founderTechnicalDepth`, `founderRiskLanguage`, and `founderAttributionBoundaries`.
   For narrow specialist roles, lead with the specialty and keep founder scope as supporting evidence. Use founder-forward positioning for roles that reward ownership, personnel responsibility, ambiguity, client responsibility, product influence, or platform scope.
   For a current or former founder, record a positive `founderCommitmentBridge` in the private application/interview plan: why now, why this role, and why this organization. Do not add defensive transition prose to the resume.
   When production scale is part of the hiring bar, build a private scale surface across deployment tenure, customers/users, data/storage/record footprint, traffic, reliability, and operating ownership. Prefer at least three role-relevant dimensions plus one reliability or operations signal in public copy. An isolated exact request count is not a scale narrative.
   Keep exact values, source commands, capture dates, and definitions in private evidence. Public wording may use conservative floors or rounded bands only when the private math supports them. Preserve the measurement window and noun: do not turn registered accounts into active users, database rows into assets, target 5XX rate into uptime, or company customers into platform users.
11. Read any available claim-significance ranking.
   Use it to decide which true claims deserve limited resume space after target-role relevance and claim confidence are considered.
   Also load configured signature evidence anchors and the strongest prior relevant resume. Build a preservation table before drafting: `retain`, `retarget`, `defer with reason`, or `not relevant`. Enable `evidenceAnchors` for every retained or retargeted anchor. Do not let brevity, keyword optimization, or caution silently replace a supported specific claim with a generic one.
12. Read any trusted reviewer principles or prior critique notes that apply to the role, source, or resume type.
   Build a principle application table before the draft is marked ready: `applied`, `partial`, `deferred`, or `not applicable`.
   Treat source-backed principles as workflow inputs, not optional comments.
13. For technical roles, include at least one graph-backed AI-native development signal when available.
   Prefer outcomes such as agentic software delivery, AI-assisted testing/review, coding-agent orchestration, human-in-the-loop quality gates, prompt/workflow standards, or named tools such as Claude Code, Codex, and Cursor when the graph supports them.
   Treat these as AI-assisted development evidence, not agent-platform construction evidence. A platform claim needs a deployed boundary, consumers, runtime behavior, and operating proof.
14. Translate company/posting language into candidate-owned role language.
   Do not put the target company name in the resume body by default; say what the candidate has done that maps to the role.
15. Retarget the structure, not only the keywords.
   Change headline, summary, skill groups, bullet selection, bullet order, and domain framing when the target role calls for it.
16. Draft resume JSON or Markdown against the page, word, character, line, bullet, section, and style targets.
17. Apply `ResumeConstraints`.
18. When outcome metrics are not sourced, prefer verified scope metrics such as years owned, peak team size, direct commit count, multi-author history, product surface, module/file scope, customer-facing delivery, or program participation.
   For scale-sensitive targets, configure `productionScaleNarrative` with source-backed dimensions, approved public phrases, private exact patterns that should not appear publicly, and required timeframe plus operations/reliability signals. Conservative rounding is not permission to hide a true stage, traffic, concurrency, or organizational-scale gap.
19. Word team-led work as leadership when the candidate owned direction, scoping, review, mentoring, delivery, standards, or cross-functional coordination.
20. Run `evidence-auditor`.
21. Run `voice-auditor`.
   For heavily tailored or agent-platform resumes, configure `semanticBulletReview`; remove semantically duplicate bullets, flag posting echoes that lack proof, and record an explicit manual review result with notes.
22. Remove fourth-wall guidance from applicant-facing files.
23. Save a new private resume version.
24. Update the private resume version note, opportunity note, application tracker, and structured opportunities JSON.
   Keep referral and recruiter-contact state here. A referral submission or privacy notice proves intake, not recruiter review or hiring-manager advocacy.
25. Render the resume to the configured private rendered-resume output with `render-resume-pdf`.
    Do not rely on the browser print dialog; it can add file URLs, dates, and page numbers as headers/footers.
26. Improve scanability with section contrast, role-block separation, selective proof-point bolding, and readable leading.
27. Name the final artifact by candidate and role, not target company, unless there is an explicit human override.
28. Run `run-resume-quality-gates`.
    Confirm the rendered PDF, rendered-text verification, and saved page images were all produced from the same final source revision. Regenerate stale visual proof instead of carrying it forward from an earlier PDF.
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
- Do not flatten founder/operator experience into a title plus ordinary IC bullets when the graph supports sustained cross-functional ownership. Founder breadth should materially change the opening, top-half proof mix, and bullet selection.
- Do not say founder years count double or imply startup experience is inherently superior to other employment. Show why the scope matters with evidence.
- Do not use founder shorthand that amplifies fit or commitment concerns, including `wore many hats`, `did everything`, `visionary founder`, `serial entrepreneur`, or `used to being my own boss`.
- Do not make the founder identity more prominent than the target professional identity unless the posting explicitly seeks founders or entrepreneurs.
- Do not mark reviewer feedback as done unless the version note records what changed and what remained intentionally deferred.
- Do not treat every true skill as equally important; use claim significance to decide what gets space.
- Frame adjacent experience honestly.
- Do not use "ramp-ready," "adjacent," or similar wording to include a tool as a public skill claim unless the user has explicitly approved that tool for resume use.
- Remove do-not-claim skills.
- Do not present AI tooling as a generic buzzword list; connect Claude Code, Codex, Cursor, or agent workflows to delivery, quality, review, testing, or developer productivity outcomes.
- Do not present coding-agent usage as proof that the candidate built a multi-user agent platform.
- Do not let founder breadth stand in for unsupported distributed-systems scale. State verified scope and users; omit concurrency, queueing, idempotency, tracing, SLO, and production-scale claims unless the evidence map supports them.
- Do not make one exact telemetry number carry the production story. When scale matters, pair defensible dimensions such as tenure, customers/users, data footprint, traffic, and reliability/operations. Use rounded public wording only when it is traceable to exact private evidence and does not imply a larger tier.
- Respect max page count.
- Prefer ATS-safe formatting unless the target role calls for a designed resume.
- The final report must name the skill files, agent files, graph/workspace files, quality gates, and validation commands used.
