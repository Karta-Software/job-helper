# Job Helper Workflow

This document is the working contract for how Job Helper improves as the user critiques the job-search process.

## Operating Model

Job Helper sits between a private career graph and public/application artifacts:

```text
career graph -> job helper -> private outputs -> completed artifacts -> portfolio or application
```

The career graph is the source of truth for personal context. Job Helper is the reusable engine that turns that context into structured decisions, resume drafts, opportunity tracking, interview prep, and publishing plans.

Every nontrivial run follows `docs/agent-run-protocol.md`. Skills define workflow steps, agents define role-specific judgment, and private graph/workspace files provide candidate-specific truth. A run is incomplete when it produces output but cannot say which skills, agents, private files, validations, commits, and push status were involved.

## Critique-Driven Improvement Loop

Use this loop whenever the user says the workflow should work differently:

1. Restate the critique as a workflow requirement.
2. Decide whether it is personal context, reusable product behavior, or both.
3. If it is personal context, update the private career graph and private workspace.
4. If it is reusable behavior, update this repo:
   - docs for process changes
   - skills for repeatable workflows
   - agents for role-specific judgment
   - schemas for durable data shape
   - source modules for shared logic
   - examples for safe fake-data demos
5. Validate the graph, JSON, and git state.
6. Commit reusable repo changes in a small commit and push when credentials allow.
7. Report what changed, which skills/agents/files were used, validation status, commit SHA, push status, and what remains open for critique.

## Three Stores

Workspace roles are defined in `docs/workspace-roles.md`. Real local paths come from private config or a private workspace map, not from this public repo.

### Career Graph

Stores durable, human-readable context:

- experience and evidence
- people, companies, referrals, and relationships
- opportunities and application decisions
- resume standards and source-backed research
- interview prep and story bank

### Private Workspace

Stores operational data that should not be committed:

- `resumes/versions/`
- `resumes/rendered/`
- `resumes/completed/`
- `resumes/standards/resume-standards.json`
- `resumes/standards/resume-quality-gates.json`
- `jobs/opportunities.json`
- `jobs/tracker.json`
- `jobs/postings/`
- `jobs/finder-runs/`
- `study/`
- `outputs/`

### Agent-Managed Support Shelf

Stores files that are useful during an application or prep run but should not be part of the user's normal navigation:

- quick actions and autofill helpers
- drill answer exports
- pasted transcripts or paste targets
- temporary cheat sheets and meeting-prep pages
- legacy working files waiting for archive or promotion

Agents should operate this shelf on the user's behalf. If a file becomes ready to use, promote it to the human-facing shelf, completed private workspace, or portfolio handoff. If it is stale, archive it under the configured legacy area. Do not make the user browse support folders to find the current artifact.

### Job Helper Repo

Stores reusable machinery:

- agent templates
- skills
- schemas
- source modules
- docs
- fake examples
- config examples

## Standard Workflows

### Track An Opportunity

Use when the user mentions a company, role, referral, recruiter lead, or possible application.

1. Add or update the opportunity note in the career graph.
2. Link company, referral path, target criteria, resume, and application tracker.
3. Capture posting URL, requisition id, location, remote eligibility, salary range, deadline, referral status, and application path when available.
4. Mirror operational fields to `jobs/opportunities.json`.
5. Check hard gates before tailoring, especially location fit and dealbreakers.
   Referred nonlocal roles may proceed to a fast draft only when the tracker records why the exception is worth the time.
6. Set the earliest accurate status.
   A referral submission, ATS confirmation, or privacy notice proves intake only. Track recruiter contact, recruiter review, hiring-manager advocacy, and interview movement as separate evidence-backed states.
7. Run referral, fit, and strategy agents when enough context exists.

### Synthesize A Proxy Role Profile

Use when the real role is unposted, confidential, internal, acquisition-related, referral-driven, or otherwise under-specified, but similar public postings or company/team pages are available.

1. Collect public proxy sources and save source URLs in the private workspace.
2. Cluster requirements across sources by recurring skills, responsibilities, domain signals, seniority, delivery practices, and company language.
3. Separate common signals from one-off requirements in a single posting.
4. Build a proxy target profile instead of treating any one posting as authoritative.
5. Draft a first-pass resume using only confirmed graph-backed claims and careful adjacent framing.
6. Create a skill-gap questionnaire for proxy-source requirements that are not already confirmed.
7. Generate a second-pass resume only after the user rates the gaps.

### Research Resume Standards

Use when deciding resume length, sections, formatting, or content density.

1. Gather current market data and recruiter/ATS guidance.
2. Separate current data, survey data, institutional policy, and inference.
3. Produce explicit targets for pages, words, characters, lines, bullets, sections, and style.
4. Save a graph note and `resumes/standards/resume-standards.json`.
5. Make `tailor-resume` read those standards before drafting.

### Apply Resume Principles

Use when a reviewer, recruiter, hiring manager, trusted peer, or prior workflow critique gives reusable resume advice.

1. Capture each principle in the private graph or configured workspace with source, date, scope, and evidence level.
2. Classify each principle before drafting:
   - `required`: should apply to this resume unless explicitly overridden.
   - `conditional`: applies only for certain roles, seniority levels, formats, or sources.
   - `advisory`: useful judgment, but not a gate.
3. Convert principles into concrete checks.
   Examples: top-half leadership, evidence-gated metrics, no underfilled page, posting-aligned skills, no inconsistent bolding, shorter bullets, and CTO/startup summary only when it earns space.
   When a reviewer asks for more numbers, use `metricSignals` to require configured safe proof phrases rather than relying on a subjective read.
4. If a reviewer critique targets something previously measured only as a warning, tune the target gate or raise severity so the final report proves the critique was handled.
   Do not call a reviewer-specific resume ready while the exact reviewer concern remains a failed warning unless a human override explains why.
5. During drafting, keep a principle application table with `applied`, `partial`, `deferred`, or `not applicable`.
6. When a requested metric is useful but not sourced, use a safer scope metric instead.
   Examples: years owned, peak team size, direct commits, multi-author commit history, PR-numbered work, file/module scope, product surface, customer-facing delivery, or verified program participation.
   When production scale is the concern, do not substitute one exact traffic number. Build a private scale surface across tenure, customers/users, data/storage/records, traffic, reliability, and operating ownership. Public copy should normally use at least three role-relevant dimensions plus one reliability or operations signal.
   Exact source values, dates, definitions, and commands remain private. Public rounding must be conservative, reproducible, and noun-preserving. It cannot turn registered accounts into active users, stored objects into customer assets, or a target 5XX rate into uptime.
   Duration claims are recomputed from exact source dates for every artifact. Use the completed-year floor as of the artifact date, not the weakest historical phrase or the minimum threshold from an older posting. When tenure is material, configure `numericConsistency` to block stale understatement and unsupported rounding up.
7. Reframe team-led work honestly.
   If the candidate led direction, reviewed PRs, scoped work, mentored engineers, or owned delivery without writing every line, say that directly instead of using lone-hero wording.
8. Translate founder/operator scope when it is the candidate's primary recent experience.
   Put verified tenure, hands-on ownership, and team scope near the top. Show at least three target-relevant dimensions and one defensible scale or business signal. Configure founder signal checks for target-role translation, operating proof, collaboration, technical depth, risk language, and attribution boundaries. Record a positive why-now/why-role/why-organization commitment bridge outside the resume.
9. Route unapplied required principles back to the right agent before the resume is marked ready.
   Use `resume-writer` for structure, hierarchy, whitespace, bullet length, and summary choices; `experience-finder` for missing proof; `evidence-auditor` for metrics and claims; and `voice-auditor` for tone, hype, and consistency.
10. Record deferred principles in the resume version note so a human can see what was intentionally left out and why.

### Automatic Artifact Routing

The user should not need to remember workflow skill names.

- Resume creation, rewriting, targeting, revision, finalization, or readiness requests automatically invoke `skills/create-resume.skill.md`. Evidence discovery, independent reviews, rendering, quality gates, and the stop-rule decision are mandatory.
- Cover-letter creation, rewriting, targeting, revision, finalization, or readiness requests automatically invoke `skills/create-cover-letter.skill.md`. The 100-point rubric, canonical `85/100` threshold, manual reviews, blocking gates, and rendered-PDF verification are mandatory.
- Role-fit or skill-gap requests automatically invoke `skills/audit-role-skills.skill.md` when required or preferred criteria remain unclassified. Returned answers must update the private evidence graph before they can become public claims.

`tailor-resume`, `write-cover-letter`, and `discover-skills` remain lower-level workflow stages. Running one lower-level stage does not satisfy the top-level completion barrier.

### Create And Tailor A Resume

Use `skills/create-resume.skill.md` when there is a target role, company, posting, or request for a new or revised resume. The user does not need to invoke it by name.

1. Read resume standards.
2. Read resume quality gates.
3. Read target criteria or posting.
4. Find graph-backed experience and evidence.
5. Load candidate identity facts and application defaults before copying or rendering header, contact, education, or legal-form content.
6. Build or refresh an experience surface map before drafting.
   Split each major employer/project into responsibility buckets, product/domain buckets, and proof-point buckets so the resume can target the role from the right angle instead of reusing the same anecdotes.
7. Build a claim/evidence mix before drafting: durable skills, role-fit experience, scope, and outcomes come first; anecdotes are supporting citations, not the resume backbone.
   Classify required and preferred skills as `supported`, `adjacent`, `project-only`, or `do-not-claim`, with evidence references. Keywords do not change claim status.
   Load the candidate's configured signature evidence anchors and the strongest prior relevant resume. Record whether each anchor will be retained, retargeted, deliberately deferred, or is not relevant. Configure `evidenceAnchors` for every retained or retargeted item.
8. When founder/operator experience is the primary recent role, apply founder scope density before drafting.
   Translate the title into verified tenure, hands-on ownership, team scope, at least three target-relevant responsibility dimensions, and one safe scale or business signal when available. Build the draft to pass all six `founderSignalBalance` results. For established employers, record a positive transition rationale outside the resume.
   If the posting uses production traffic, adoption, data volume, or reliability as a seniority bar, configure `productionScaleNarrative`. The gate must require source-backed dimensions, an operations/reliability signal, approved public scale phrases, a timeframe, and the absence of configured private exact values. It cannot turn a wording improvement into evidence of a scale tier the candidate has not operated.
9. For technical roles, include at least one evidence-backed AI-native development signal when the candidate graph supports it.
   Acceptable signals include coding-agent orchestration, AI-assisted testing/review, agent workflow design, human-in-the-loop guardrails, prompt/workflow standards, or named tools such as Claude Code, Codex, and Cursor when they are tied to engineering outcomes.
   Omit or de-emphasize this only when the target role makes AI tooling irrelevant, distracting, or risky.
   When omitted for target fit, remove AI-tooling phrases from required keyword rewards and add target-specific unsupported terms if the prior workflow over-rewarded them.
   For agent-platform, AI-platform, or agent-foundations roles, do not count coding-agent usage as platform-building evidence. Configure `agentPlatformEvidenceDepth` and require at least four source-backed dimensions: deployment boundary, users/consumers, durable state/runtime, failure/idempotency, observability/evaluations, and scale/measured outcome.
   Put concrete architecture and a measured outcome in the top half. Founder breadth can support ownership, but it cannot substitute for unsupported distributed-systems scale.
10. Translate the target role into role-facing themes, not company-facing branding.
   Emphasize the candidate's matching domains, systems, language, and proof points; do not say "strong fit for <company>" or put the target company name in the applicant-facing resume by default.
11. Rewrite the resume structure around the target role when needed.
   Strong tailoring means changing the headline, summary, skill groupings, bullet selection, bullet order, and domain emphasis. It is not enough to preserve the old resume and sprinkle in keywords.
   Tailoring must not silently weaken approved evidence. If a prior specific claim becomes a generic phrase or disappears, the version note must explain why and the configured evidence anchor must still pass.
12. Draft against section and length constraints.
13. Audit evidence and voice.
   Configure `semanticBulletReview` when the resume is heavily tailored: detect bullets that repeat the same implementation, detect posting echoes without proof, and require a manual semantic/voice pass with notes.
14. Render privately from HTML to PDF with the helper's PDF renderer.
   Browser print headers and footers must be disabled; raw `resume.html` is a source artifact, not the sendable artifact.
15. Treat render command failure as fatal before copying or promoting any PDF.
16. Apply scanability styling: strong section anchors, clear role blocks, selective bolding for proof points, readable leading, and enough whitespace for parsing without leaving the page underfilled. Do not use empty padding or decorative rules to simulate page utilization.
17. Name completed artifacts by candidate and role, not target company, unless a human explicitly overrides for a specific application system.
18. Run resume quality gates.
19. Configure and run `educationWording` when candidate defaults require exact education wording or stale degree labels must be blocked.
20. Verify the rendered PDF text for target-specific must-have and must-not-have phrases such as education wording, target-branding removal, and forbidden stale terms.
   Regenerate page images and visual-inspection artifacts from that same final PDF. Enable `artifactFreshness` for packaged visual proof. A package with a current PDF and stale screenshots is not verified.
21. Notify mapped agents for failed gates and rework until gates pass or the iteration limit is reached.
22. Save completed artifact only after approval.
23. Publish only through the configured portfolio handoff.

### Education And Coursework

- For senior, staff, principal, product-owner, or founder/operator resumes, omit `Relevant coursework` by default.
- Include coursework only when the posting explicitly asks for coursework, the candidate lacks stronger role evidence for a required education keyword, or the user records a deliberate override.
- If coursework is included, record the reason in the private resume version note. Do not let copied old artifacts reintroduce stale degree labels or entry-level education filler.
- Keep education compact. A degree and a certificate should normally render as one line each when the text fits at a readable size. Use `educationRenderedLines` to block unnecessary display-block details or blank rows.

### Run Resume Quality Gates

Use after rendering a resume draft.

1. Measure page count, page utilization, word count, character count, rendered text lines, bullet lengths, and achievement bullet count.
   Page count must be measured from the final rendered PDF when a PDF exists.
   Page utilization should measure rendered HTML content height against the printable one-page area so one-page resumes do not leave excessive bottom whitespace.
   For one-page resumes, bottom whitespace should visually approximate the page margins, usually around 3% to 3.5% of the printable page content height.
   The visual bottom-gap gate must inspect the final PDF, not only the source HTML. Render the first PDF page to pixels and compare the bottom non-white gap against the top and side gaps.
   Also measure the last meaningful text row after excluding page-width decorative rules. Configure `visualMeaningfulBottomToReferenceMarginRatio` so a bottom border cannot hide an underfilled page.
   Reject PDFs that contain browser print headers or footers such as file URLs, local paths, dates, or page numbers from the print dialog.
   Manual page or rendered-line counts require explicit override flags and must be disclosed in the report.
   Source Markdown line count is useful context, but it is not rendered text-line count.
2. Check required sections.
   Header-derived sections such as contact block or headline may be inferred, but inferred sections must be disclosed in the report.
3. Compare resume keywords against posting keywords.
   The report must label whether the keyword denominator came from configured required keywords, supplied posting keywords, or extracted posting keywords.
   Keyword match cannot compensate for failed evidence-depth or claim-support gates.
4. For agent-platform roles, check configured `agentPlatformEvidenceDepth`.
   Count only dimensions with matching resume language, `supported` evidence status, and source references. Require platform-building signals beyond Claude Code, Codex, or other agent-tool usage, plus a top-half architecture bullet and top-half measured outcome.
5. For scale-sensitive roles, check configured `productionScaleNarrative`.
   Require multiple source-backed production dimensions, an operations or reliability signal, a timeframe, approved conservative public phrasing, and no configured private exact leakage. Reject isolated telemetry and vague `large-scale` claims even when the numbers are true.
6. Check configured `evidenceAnchors` for signature evidence that should survive tailoring.
   Require source references, supported evidence status, approved public terms, and the absence of configured weakening or private-boundary terms. Failing to preserve a supported specific claim is a blocking evidence failure even when the new wording is technically true.
7. Check configured `semanticBulletReview` when tailoring is substantial.
   Mechanically flag duplicate concepts and posting echoes without proof. Require `manualReviewStatus: pass` with notes because semantic duplication and AI-sounding mimicry still need judgment.
8. Check configured `metricSignals` when reviewer feedback or role standards require visible numbers.
   This gate counts configured proof patterns, such as years owned, peak team size, direct commits, verified programs, sourced business metrics, or other safe metric phrases.
9. Check configured `numericConsistency` when a resume has multiple related numbers or reviewer-sensitive metrics.
   This gate extracts named numeric claims, checks relationships such as totals, ratios, or minimum ordering, and blocks ambiguous wording where a true number is attached to the wrong label.
   Use it to keep counts like commits, reviewed PRs, revenue, retention, defect rates, and cost reductions internally consistent across the document.
10. Check for unsupported technology or experience terms that are not backed by the graph.
   Unsupported-term matching is a denylist guardrail; it does not replace graph-backed claim evidence review.
11. Check approved skill claims against the configured skill inventory.
   A role keyword should not appear in applicant-facing resume text just because the posting asks for it. If the candidate has not approved the skill as resume-claimable, remove it or move it to private interview/prep notes.
12. Check for private paths, internal notes, and application-only commentary.
13. Check target branding.
   Applicant-facing resumes and artifact filenames should not include the target company name by default; company-specific strategy belongs in the private tracker, graph note, or application plan.
14. Check configured `reviewerPrinciples`.
   Required reviewer principles should emit one result per principle, such as top-half leadership, supportable `Led a team of X engineers` wording, top-half proof terms, consistent emphasis, and team-led work not being flattened into lone-IC wording.
   When founder/operator experience is central, enable `founderSignalBalance`; all six named founder results must pass. Configure existing leadership, top-half proof, team-led wording, and `metricSignals` as supporting checks. A title-only founder mention should fail review.
15. Treat reviewer-related warning failures as not ready when the warning is the concrete thing the reviewer asked to fix.
   Either tune the target-specific ideal range, raise the gate to `error`, rework the resume, or record a human override.
16. Treat `error` gate failures like CI failures.
17. Route failures to the configured rework agent.
18. Keep the resume in rendered drafts until all `error` gates pass and reviewer-related warnings are resolved or a human override is recorded.

### Score A Resume

Use when deciding whether a resume is strong enough to send.

Default 100-point weighting:

- 30 points: role fit and tailoring to the target posting.
- 25 points: evidence-backed experience, outcomes, scope, and metrics.
- 15 points: keywords and skills that match the posting without unsupported claims.
- 10 points: clear structure and ATS-safe formatting.
- 10 points: scanability, page utilization, contrast, bullet rhythm, and section hierarchy.
- 7 points: positioning story, meaning a clear professional through-line and opening pitch.
- 3 points: personality signals, only when they support trust, judgment, collaboration, or leadership.

Story should make the resume coherent and targeted. It should not compete with role fit, proof, and parseable structure.

Proof points should be selected like evidence in a sales pipeline. A memorable anecdote earns space when it proves a target-relevant claim better than a broader or more repeatable example. Do not overfit a resume around isolated anecdotes when the candidate's durable experience and skill pattern is the stronger signal.

Quantified anecdotes should pass a relevance test: the metric needs to prove a role-critical capability, clarify scope, show a repeatable operating pattern, or differentiate the candidate. A metric that is true but disconnected from the target role should move to interview prep or a proof bank.

### Create, Write, And Grade A Cover Letter

Use `skills/create-cover-letter.skill.md` as the top-level workflow. It must run `skills/write-cover-letter.skill.md`, then `skills/run-cover-letter-quality-gates.skill.md`.

A cover letter exists to show why this candidate is useful for this exact employer problem now. It should add motivation, interpretation, and a memorable proof story that the resume does not communicate efficiently. It should not restate the resume in paragraphs.

Required workflow:

1. Verify the company, role, requisition, recipient, posting, and current application context.
2. Write explicit private answers for why company, why role, and why now.
3. Map at least two employer needs to source-backed candidate evidence.
4. Draft a one-page letter in the candidate's voice.
5. Run `cover-letter-critic`, `evidence-auditor`, and `voice-auditor` independently.
6. Run the company-swap test. If a competitor name can replace the employer without substantive changes, rewrite the letter.
7. Record what the letter adds beyond the resume.
8. Render the PDF and run `scripts/check-cover-letter-quality.mjs` with a private target-specific gate config.
9. Promote the artifact only when the score is at least 85 and every blocking gate passes.

Weighted rubric:

- correct target and audience: 10
- why this company, role, and moment: 15
- understanding of the employer's problem: 15
- evidence connected to role needs: 20
- narrative added beyond the resume: 15
- authentic and memorable voice: 10
- evidence accuracy and boundaries: 10
- structure and rendering: 5

Decision thresholds:

- `SEND`: 85-100 and all error gates pass.
- `REVISE`: 75-84 and all error gates pass.
- `REWRITE`: below 75 and all error gates pass.
- `DO NOT SEND`: any error gate fails, regardless of score.

Blocking gates cover target identity, one-page rendering, word count, source-backed evidence, two need-to-evidence bridges, direct motivation, company specificity, the company-swap test, resume complement, voice review, configured generic phrases, and verified referral use when applicable. Manual review notes are required because keyword matching cannot prove motivation, specificity, or authentic voice.

### Build An Experience Surface Map

Use when a large role, employer, project, or consulting engagement is too broad to fit cleanly into one job description.

1. Read the experience note, skill inventory, domain map, evidence backlog, current resume, and target role criteria.
2. Split the experience into responsibility buckets such as product ownership, engineering delivery, infrastructure, support, customer work, leadership, documentation, quality, release operations, and technical debt.
3. Split the experience into product/domain buckets such as platforms, reporting, analytics, GIS, IoT, workflow systems, data products, developer tooling, AI systems, or other target-relevant domains.
4. Split proof into anecdotes, metrics, source artifacts, and interview stories.
5. Mark each item as direct, adjacent, interview-only, needs-source, or do-not-claim.
6. Use the map to choose resume themes before drafting bullets.
7. Update private graph notes when the map reveals a new durable bucket, source gap, or do-not-claim guardrail.

The surface map should not be applicant-facing by default. It is scaffolding for stronger tailoring: first choose the right role angle, then choose the anecdotes that prove it.

### Discover Skills

Use when the user wants to uncover skills that are missing from the graph or resume.

1. Read the current resume, skill inventory, evidence notes, and target role criteria.
2. Ask grouped 3/2/1 questions: `3` means defensible, `2` means partial or adjacent, and `1` means do not claim.
3. Include enough plain-language context for unfamiliar tools, standards, and domains so the user can judge adjacency instead of guessing.
4. When the user chooses `2`, capture the reason it is adjacent: similar tool, transferable pattern, light exposure, domain cousin, or concrete project/story.
5. In interactive questionnaires, present suggested adjacency reasons as toggles and keep optional free text for anything the toggles miss.
6. Save answers and adjacency rationale to the private career graph before generating resume copy.
7. Treat `3` as self-confirmed but still needing sourceable examples for strong resume claims.
8. Treat `2` as interview/story material or light positioning unless stronger evidence is added.
9. Treat `1` as an unsupported/do-not-claim guardrail.

For a specific posting, use `skills/audit-role-skills.skill.md` as the top-level role intake:

1. Extract every required and preferred criterion and split compound criteria into atomic items.
2. Assign stable `REQ-##` and `PREF-##` IDs and preserve the original posting text.
3. Classify known items as confirmed, partial-adjacent, unconfirmed, or do-not-claim before asking questions.
4. Ask unresolved items through a standalone private HTML page with neutral `Yes`, `Some / adjacent`, `No`, and `Unsure` controls.
5. Include local draft persistence and complete `Copy all results` / download export. The export must include every ID, including unchanged known items and blank fields.
6. Write pasted answers back to the private Skill Inventory, evidence backlog, experience notes, and role matrix.
7. Treat `Yes` without evidence details as self-confirmed with an evidence gap, not automatic support for a strong public claim.

### Rank Claim Significance

Use when the resume has too many true skills, anecdotes, proof points, domains, or tools competing for limited space.

1. Load confirmed skills, partial skills, major proof points, target roles, and recent resume drafts.
2. Ask the user to rank items by significance, not truth:
   - Headliner: should shape most technical resumes.
   - Strong support: often worth a bullet or skills-line slot.
   - Role-specific: include when the posting asks for it.
   - Interview only: useful stories, not default resume space.
   - De-emphasize: true or adjacent, but usually not strategic.
3. Preserve order within each tier; order is a signal.
4. Capture optional notes explaining why an item matters or when to use it.
5. Save the ranking to the private career graph or private workspace.
6. During resume tailoring, use significance ranking after claim confidence and target-role relevance to decide what earns space.
7. Re-run ranking when the candidate changes target roles, adds major new evidence, or notices that resumes are overweighting weak anecdotes.

### Critique The Workflow

Use when the user says the process, data model, agent behavior, or handoff feels wrong.

1. Capture the critique as a requirement.
2. Update this document if the operating process changes.
3. Update the affected skill, agent, schema, source module, or example.
4. Add a graph note when the critique is durable career context.
5. Validate and summarize the new operating rule.

## Current Product Rules

- Opportunities can exist before exact postings.
- Similar postings can be used to synthesize a proxy target profile for unposted or relationship-driven roles.
- Referrals are first-class pipeline data.
- Application deadlines are first-class pipeline data.
- Location fit is a hard gate before normal resume tailoring.
- Strong referrals can justify a fast draft while remote or local compatibility is being confirmed.
- Job recommendations must be related to the candidate's actual experience, target roles, or accepted stretch goals.
  Same-company roles are not "related" by default; show an evidence-overlap summary or label the role as unrelated/discovery-only.
- Supporting folders are agent-managed by default. Human-facing shelves should stay shallow, curated, and ready-to-use.
- `ready-to-apply` means the resume/materials are done, but the application has not been submitted yet.
- Resume standards are source-backed and revisable.
- Resume quality gates are CI-style checks; failed `error` gates must notify agents and block completed artifacts.
- Approved-skill gates should compare applicant-facing skill/tool claims against the skill inventory. Adjacent, unknown, or "ramp-ready" skills are not public skill claims unless the user explicitly approves that phrasing.
- Completed resumes must be generated through the helper's PDF renderer with browser headers and footers disabled.
- Raw HTML resume files are source/preview artifacts, not application artifacts.
- Page-count gates must use the rendered PDF/final artifact, not manual assertions.
- Page-utilization gates should keep one-page resumes in the configured target band instead of passing underfilled pages. Bottom whitespace should be close to the visual page margins, not merely under a loose maximum.
- For one-page resumes, `visualBottomToReferenceMarginRatio` should usually be a hard gate. A bottom gap more than about 1.35x the top/side reference margin is visibly underfilled even when the older page-utilization metric passes.
- Scanability should come from hierarchy, leading, contrast, and selective emphasis, not decorative graphics or dense walls of text.
- Applicant-facing resumes should avoid target company names in the body and filename by default.
- Trusted reviewer principles should be first-class inputs, not comments that disappear after one draft.
- Required trusted reviewer principles should be first-class `reviewerPrinciples.*` quality-gate results, not just notes or agent memory.
- Reviewer feedback is not applied until the resume version note records what was applied, partially applied, deferred, or rejected.
- A reviewer-related warning is not harmless just because the checker can technically pass. If the warning represents the critique being addressed, resolve it, tune the target-specific range, raise severity, or record an explicit override.
- When outcome metrics are not sourced, use verified scope metrics instead of inventing or weakening the resume with unsupported numbers.
- Use `metricSignals` to prove safe numbers are visible when a reviewer asks for metrics. Do not use it as permission to add unsourced outcome metrics.
- Use `numericConsistency` to prove important numbers are internally coherent and clearly labeled. Do not let a true number pass when the surrounding noun makes it look like a different metric.
- Treat materially stale duration floors as evidence loss even when they remain technically true. Record the evidence start date and artifact as-of date, use the strongest truthful completed-year floor, and gate the exact target claim.
- Team-led project work should be worded as leadership when the candidate owned direction, review, scope, delivery, mentoring, or standards, even when other engineers wrote part of the code.
- Founder/operator experience should be translated into visible scope density when it is central: tenure, hands-on ownership, team scope, cross-functional responsibility, and safe scale/business proof. Treat it as a conditional hiring signal, orient the opening around the target role, and show collaboration and repeatable delivery to reduce fit and commitment concerns. Do not claim startup years count double or treat a founder title as self-proving.
  Use the target company in private opportunity notes, quality-gate config, source maps, and application plans instead.
- Tailoring should alter the resume's visible structure and emphasis: headline, summary, skill grouping, bullet order, and domain framing should reflect the role family.
- Anecdotes and stories are evidence for claims, not a substitute for role fit, skills, scope, outcomes, and repeatable experience.
- Claim confidence and claim significance are different signals. A `3` skill may still be low significance, and a niche proof point may be high significance for one target role only.
- Technical resumes should usually include an evidence-backed AI-native development signal when the candidate graph supports it; in 2026 this is a capability signal, not just a tooling footnote.
- If target or reviewer feedback makes AI tooling distracting, remove it from keyword rewards and make it a target-specific unsupported term so future drafts cannot accidentally reintroduce it for that target.
- Do not infer degree type from old artifacts. Education wording must come from configured candidate facts or application defaults, and target-specific gates should block stale degree labels when the configured wording is generic.
- Use the `educationWording` quality gate for exact education defaults, including generic degree wording and forbidden stale labels such as `Bachelor of Science` or `Bachelor of Arts` when those are not the configured public standard.
- `2` skill ratings should include an adjacency rationale before being used for resume positioning.
- For product-heavy roles, build a source-backed product-portfolio map and preserve several distinct product families in a concise top-half line or bullet. Add a target-specific evidence anchor so later shortening cannot silently erase that breadth.
- Interactive skill-gap forms should favor toggleable adjacency reasons over requiring the user to copy or retype suggested rationale.
- Rendered line-count gates must use a rendered-artifact measurement or report unmeasured; source Markdown lines are a separate diagnostic.
- Keyword match percentages must disclose their keyword source.
- Bullet character gates measure achievement bullets separately from skill-list bullets; hard limits and ideal ranges are reported separately.
- Tailored resumes are preferred over a single generic resume.
- Proxy-role resumes must disclose that they are first-pass drafts and avoid overfitting to one source posting.
- The portfolio receives only completed, approved resume artifacts.
- Job Helper remains identity-agnostic; config supplies personal paths and preferences.

## Open Critique Questions

- Should referral-first opportunities have a distinct one-page resume variant?
- Should each opportunity own its own checklist file in the private workspace?
- Should opportunity status changes be append-only events rather than direct record updates?
- Should agents produce a daily job-search operating brief from the graph and tracker?
