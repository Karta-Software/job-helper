# Job Helper Workflow

This document is the working contract for how Job Helper improves as the user critiques the job-search process.

## Operating Model

Job Helper sits between a private career graph and public/application artifacts:

```text
career graph -> job helper -> private outputs -> completed artifacts -> portfolio or application
```

The career graph is the source of truth for personal context. Job Helper is the reusable engine that turns that context into structured decisions, resume drafts, opportunity tracking, interview prep, and publishing plans.

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
6. Report what changed and what remains open for critique.

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
5. Draft against section and length constraints.
6. Audit evidence and voice.
7. Render privately from HTML to PDF with the helper's PDF renderer.
   Browser print headers and footers must be disabled; raw `resume.html` is a source artifact, not the sendable artifact.
8. Apply scanability styling: strong section anchors, clear role blocks, selective bolding for proof points, readable leading, and enough whitespace for parsing without leaving the page underfilled.
9. Run resume quality gates.
10. Notify mapped agents for failed gates and rework until gates pass or the iteration limit is reached.
11. Save completed artifact only after approval.
12. Publish only through the configured portfolio handoff.

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
5. Check for private paths, internal notes, and application-only commentary.
6. Treat `error` gate failures like CI failures.
7. Route failures to the configured rework agent.
8. Keep the resume in rendered drafts until all `error` gates pass or a human override is recorded.

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

### Discover Skills

Use when the user wants to uncover skills that are missing from the graph or resume.

1. Read the current resume, skill inventory, evidence notes, and target role criteria.
2. Ask grouped 3/2/1 questions: `3` means defensible, `2` means partial or adjacent, and `1` means do not claim.
3. Save answers to the private career graph before generating resume copy.
4. Treat `3` as self-confirmed but still needing sourceable examples for strong resume claims.
5. Treat `2` as interview/story material or light positioning unless stronger evidence is added.
6. Treat `1` as an unsupported/do-not-claim guardrail.

### Critique The Workflow

Use when the user says the process, data model, agent behavior, or handoff feels wrong.

1. Capture the critique as a requirement.
2. Update this document if the operating process changes.
3. Update the affected skill, agent, schema, source module, or example.
4. Add a graph note when the critique is durable career context.
5. Validate and summarize the new operating rule.

## Current Product Rules

- Opportunities can exist before exact postings.
- Referrals are first-class pipeline data.
- Application deadlines are first-class pipeline data.
- Location fit is a hard gate before normal resume tailoring.
- Strong referrals can justify a fast draft while remote or local compatibility is being confirmed.
- `ready-to-apply` means the resume/materials are done, but the application has not been submitted yet.
- Resume standards are source-backed and revisable.
- Resume quality gates are CI-style checks; failed `error` gates must notify agents and block completed artifacts.
- Completed resumes must be generated through the helper's PDF renderer with browser headers and footers disabled.
- Raw HTML resume files are source/preview artifacts, not application artifacts.
- Page-count gates must use the rendered PDF/final artifact, not manual assertions.
- Page-utilization gates should keep one-page resumes in the configured target band instead of passing underfilled pages.
- Scanability should come from hierarchy, leading, contrast, and selective emphasis, not decorative graphics or dense walls of text.
- Rendered line-count gates must use a rendered-artifact measurement or report unmeasured; source Markdown lines are a separate diagnostic.
- Keyword match percentages must disclose their keyword source.
- Bullet character gates measure achievement bullets separately from skill-list bullets; hard limits and ideal ranges are reported separately.
- Tailored resumes are preferred over a single generic resume.
- The portfolio receives only completed, approved resume artifacts.
- Job Helper remains identity-agnostic; config supplies personal paths and preferences.

## Open Critique Questions

- Should referral-first opportunities have a distinct one-page resume variant?
- Should each opportunity own its own checklist file in the private workspace?
- Should opportunity status changes be append-only events rather than direct record updates?
- Should agents produce a daily job-search operating brief from the graph and tracker?
