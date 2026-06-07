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

### Tailor A Resume

Use when there is a target role, company, or posting.

1. Read resume standards.
2. Read resume quality gates.
3. Read target criteria or posting.
4. Find graph-backed experience and evidence.
5. Build a claim/evidence mix before drafting: durable skills, role-fit experience, scope, and outcomes come first; anecdotes are supporting citations, not the resume backbone.
6. For technical roles, include at least one evidence-backed AI-native development signal when the candidate graph supports it.
   Acceptable signals include coding-agent orchestration, AI-assisted testing/review, agent workflow design, human-in-the-loop guardrails, prompt/workflow standards, or named tools such as Claude Code, Codex, and Cursor when they are tied to engineering outcomes.
   Omit or de-emphasize this only when the target role makes AI tooling irrelevant, distracting, or risky.
7. Translate the target role into role-facing themes, not company-facing branding.
   Emphasize the candidate's matching domains, systems, language, and proof points; do not say "strong fit for <company>" or put the target company name in the applicant-facing resume by default.
8. Rewrite the resume structure around the target role when needed.
   Strong tailoring means changing the headline, summary, skill groupings, bullet selection, bullet order, and domain emphasis. It is not enough to preserve the old resume and sprinkle in keywords.
9. Draft against section and length constraints.
10. Audit evidence and voice.
11. Render privately from HTML to PDF with the helper's PDF renderer.
   Browser print headers and footers must be disabled; raw `resume.html` is a source artifact, not the sendable artifact.
12. Apply scanability styling: strong section anchors, clear role blocks, selective bolding for proof points, readable leading, and enough whitespace for parsing without leaving the page underfilled.
13. Name completed artifacts by candidate and role, not target company, unless a human explicitly overrides for a specific application system.
14. Run resume quality gates.
15. Notify mapped agents for failed gates and rework until gates pass or the iteration limit is reached.
16. Save completed artifact only after approval.
17. Publish only through the configured portfolio handoff.

### Run Resume Quality Gates

Use after rendering a resume draft.

1. Measure page count, page utilization, word count, character count, rendered text lines, bullet lengths, and achievement bullet count.
   Page count must be measured from the final rendered PDF when a PDF exists.
   Page utilization should measure rendered HTML content height against the printable one-page area so one-page resumes do not leave excessive bottom whitespace.
   Reject PDFs that contain browser print headers or footers such as file URLs, local paths, dates, or page numbers from the print dialog.
   Manual page or rendered-line counts require explicit override flags and must be disclosed in the report.
   Source Markdown line count is useful context, but it is not rendered text-line count.
2. Check required sections.
   Header-derived sections such as contact block or headline may be inferred, but inferred sections must be disclosed in the report.
3. Compare resume keywords against posting keywords.
   The report must label whether the keyword denominator came from configured required keywords, supplied posting keywords, or extracted posting keywords.
4. Check for unsupported technology or experience terms that are not backed by the graph.
   Unsupported-term matching is a denylist guardrail; it does not replace graph-backed claim evidence review.
5. Check approved skill claims against the configured skill inventory.
   A role keyword should not appear in applicant-facing resume text just because the posting asks for it. If the candidate has not approved the skill as resume-claimable, remove it or move it to private interview/prep notes.
6. Check for private paths, internal notes, and application-only commentary.
7. Check target branding.
   Applicant-facing resumes and artifact filenames should not include the target company name by default; company-specific strategy belongs in the private tracker, graph note, or application plan.
8. Treat `error` gate failures like CI failures.
9. Route failures to the configured rework agent.
10. Keep the resume in rendered drafts until all `error` gates pass or a human override is recorded.

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
- `ready-to-apply` means the resume/materials are done, but the application has not been submitted yet.
- Resume standards are source-backed and revisable.
- Resume quality gates are CI-style checks; failed `error` gates must notify agents and block completed artifacts.
- Approved-skill gates should compare applicant-facing skill/tool claims against the skill inventory. Adjacent, unknown, or "ramp-ready" skills are not public skill claims unless the user explicitly approves that phrasing.
- Completed resumes must be generated through the helper's PDF renderer with browser headers and footers disabled.
- Raw HTML resume files are source/preview artifacts, not application artifacts.
- Page-count gates must use the rendered PDF/final artifact, not manual assertions.
- Page-utilization gates should keep one-page resumes in the configured target band instead of passing underfilled pages.
- Scanability should come from hierarchy, leading, contrast, and selective emphasis, not decorative graphics or dense walls of text.
- Applicant-facing resumes should avoid target company names in the body and filename by default.
  Use the target company in private opportunity notes, quality-gate config, source maps, and application plans instead.
- Tailoring should alter the resume's visible structure and emphasis: headline, summary, skill grouping, bullet order, and domain framing should reflect the role family.
- Anecdotes and stories are evidence for claims, not a substitute for role fit, skills, scope, outcomes, and repeatable experience.
- Claim confidence and claim significance are different signals. A `3` skill may still be low significance, and a niche proof point may be high significance for one target role only.
- Technical resumes should usually include an evidence-backed AI-native development signal when the candidate graph supports it; in 2026 this is a capability signal, not just a tooling footnote.
- `2` skill ratings should include an adjacency rationale before being used for resume positioning.
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
