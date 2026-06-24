# Job Helper

Job Helper is a local-first career toolkit for turning a private career knowledge graph into job-search materials, interview prep, and application decisions.

The repo contains reusable code, schemas, agent templates, skills, starter decks, and fake demo data. Your real career graph, resumes, applications, and generated outputs stay outside the repo in a private workspace.

## Core Ideas

- Keep private career data out of source control.
- Keep the tool identity-agnostic. User-specific paths, voice rules, target roles, and publishing destinations belong in local config.
- Improve the toolkit whenever the user critiques the workflow, and record those process changes in `docs/workflow.md`.
- Use a knowledge graph to connect experience, skills, claims, evidence, jobs, and interview prep.
- Track resume versions instead of overwriting one resume forever.
- Track jobs separately from resume drafts.
- Synthesize a proxy role profile when a relationship-driven or internal opportunity has no exact public posting.
- Use agents for research, evidence finding, resume writing, job scoring, and drill generation.
- Practice interviews with both open-answer drills and multiple-choice mistake drills.
- Use explicit search controls for location, work mode, salary, experience stretch, and dealbreakers.
- Vet links before prioritizing applications so broken, expired, or confusing postings do not pollute the queue.
- Separate applicant-facing resumes from internal targeting notes.

## Repo Layout

```text
apps/study/              interview and study page
apps/dashboard/          future graph, resume, jobs, and agents UI
agents/                 reusable agent personalities
docs/                   reusable job-search and resume playbooks
skills/                 reusable workflows
schemas/                JSON schemas for graph, resumes, jobs, applications, drills
src/                    shared implementation modules
examples/               fake demo data safe to commit
local.example/          example shape for private local data
docs/                   operating workflow and critique loop
```

## Operating Pipeline

Job Helper is intended to sit between a private career graph and a public portfolio:

```text
career knowledge graph -> job helper -> resume/interview/application outputs -> portfolio
```

The graph should be updated frequently with work history, proof points, source files, applications, and interview notes. Job Helper reads that graph through the configured adapter, writes drafts and generated artifacts to the private workspace, and only publishes completed resume artifacts to the configured portfolio destination.

The repo should never hardcode the user's name, role, vault path, or portfolio path. Those values come from `CAREER_TOOLKIT_CONFIG` or `career-toolkit.config.json`.

See `docs/workflow.md` for the critique-driven operating process.

See `docs/agent-run-protocol.md` for the required run loop. Nontrivial runs should report the skills used, agents consulted, private graph/workspace files read or changed, quality gates, validation commands, commit SHA, and push status.

## Private Workspace

Create a private workspace outside git or in a gitignored `.career-toolkit/` folder:

```text
.career-toolkit/
  career-toolkit.config.json
  agents/local-overrides/
  skills/local-overrides/
  resumes/versions/
  resumes/rendered/
  resumes/completed/
  resumes/standards/resume-standards.json
  resumes/standards/resume-quality-gates.json
  jobs/opportunities.json
  jobs/tracker.json
  jobs/postings/
  jobs/finder-runs/
  study/progress.json
  study/generated-cards.json
  outputs/
```

## Config Contract

Start from `career-toolkit.config.example.json` and save a private `career-toolkit.config.json`.

Important sections:

- `graph`: where the career knowledge graph lives and how to read it.
- `workspace`: where private job-helper state and generated files live.
- `outputs.resumeVersions`: structured resume JSON versions.
- `outputs.renderedResumes`: rendered HTML/PDF drafts that are not necessarily ready to publish.
- `outputs.completedResumes`: send-ready resumes.
- `outputs.resumeStandards`: current resume-market standards and scoring targets.
- `outputs.resumeQualityGates`: CI-style resume checks that block completed artifacts until passing.
- `outputs.portfolio`: optional publishing target for completed resumes.

For portfolio publishing, the helper should copy only completed resume artifacts into the configured portfolio repo and update the configured index link. It should not publish drafts, unsupported claims, or private graph paths.

## Resume Standards

Use `research-resume-standards` when deciding page count, word count, character budget, sections, or formatting rules. The output should be saved to `outputs.resumeStandards` and read before `tailor-resume`.

The standards workflow uses market data, recruiter-style conversion logic, target postings, evidence audits, and voice audits. It should produce explicit page, word, character, line, bullet, section, and style targets rather than generic resume advice.

## Resume Quality Gates

Use `run-resume-quality-gates` after rendering a resume draft. Gates behave like CI checks for resumes: page count, page utilization, word count, character count, rendered lines, bullet length, required sections, keyword match, metric visibility, numeric consistency, evidence safety, reviewer principles, voice, and private-note leakage.

Failed `error` gates block the resume from moving to completed outputs. Each failing gate maps to a rework agent, such as `resume-writer`, `posting-scorer`, `experience-finder`, `evidence-auditor`, or `voice-auditor`.

Measurement rules are strict. Page count comes from the rendered PDF/final artifact, rendered line count cannot be faked with source Markdown lines, keyword reports must disclose their keyword source, and unsupported-term scans are only a denylist guardrail until a graph-backed evidence audit confirms each claim.

Reviewer-principle rules are explicit when configured. A report can require leadership near the top, supportable `Led a team of X engineers` wording, high-signal proof terms in the top half, consistent emphasis, and team-led work that is not flattened into lone-IC wording.

Scanability rules are practical: use section anchors, role-block separation, selective bolding for metrics and proof points, readable leading, and enough whitespace to parse the page. Avoid tables, icons, text boxes, skill bars, or graphics for critical content.

Measure page utilization from rendered HTML:

```bash
node scripts/measure-resume-layout.mjs --html <resume.html>
```

Render a resume PDF from HTML with browser headers and footers disabled:

```bash
node scripts/render-resume-pdf.mjs --html <resume.html> --pdf <resume.pdf>
```

Run the page-count regression tests with:

```bash
node --test scripts/check-resume-quality.test.mjs scripts/render-resume-pdf.test.mjs scripts/measure-resume-layout.test.mjs
```

Run the agent/skill utilization contract test with:

```bash
node --test scripts/check-agent-run-protocol.test.mjs
```

## Opportunity Pipeline

Store active leads in the private career graph and mirror operational fields to `.career-toolkit/jobs/opportunities.json`.

Use opportunity records before there is a specific posting. Once a posting exists, attach `jobPostingId`; once an application is submitted, attach an application record. This keeps referrals, target companies, and informal leads from getting lost before they become formal applications.

Recommended statuses: `target`, `researching`, `referral-identified`, `referral-requested`, `resume-draft`, `applied`, `recruiter-screen`, `technical-screen`, `onsite-final`, `offer`, `rejected`, `passed`, `archived`.

## Study App

Open `apps/study/index.html` in a browser. It supports:

- open-answer drills
- multiple-choice mistake drills
- hidden categories until reveal/export
- variant rotation after wrong answers
- unfamiliar-topic marking
- batch export for AI grading

## Job Search Workflow

Use `docs/job-finding-playbook.md` for the full search process. The reusable workflow is:

1. Set a `JobSearchProfile` with sliders for remote/hybrid/onsite preference, market preference, salary priority, experience stretch, domain flexibility, title flexibility, management load, technical depth, and travel tolerance.
2. Import postings from manual entries, URLs, CSVs, employer pages, and job-board searches.
3. Normalize location, work mode, compensation, full-time status, experience requirements, and source URL.
4. Review links and mark broken, expired, unavailable, confusing, or generic-search links before ranking.
5. Extract listed and implied skills, compare them to the private graph, and classify each as direct, adjacent, do-not-claim, or unknown.
6. Rank roles by fit, interest, salary, work mode, experience gate, domain gap, and link confidence.
7. Create targeted resume versions only after the posting is still available and the claim evidence is clear.

## Resume Workflow

Use `docs/resume-finalization.md` before a resume is treated as application-ready.

Resume files should not include internal notes like "best target fit" or "use this version." Keep those in a separate index or application plan. Use `schemas/resume-constraints.schema.json` to capture page limits, required sections, ATS-safe formatting, forbidden phrases, output formats, and render/page-count checks.

## What This Is Not

This is not an auto-apply tool. It helps find, rank, prepare, and track opportunities. The user still applies manually.

## First Build Targets

1. Move study cards out of the HTML and into JSON.
2. Store study progress in the private workspace.
3. Add a graph adapter for Obsidian and plain JSON.
4. Generate and track resume versions.
5. Import and score jobs from manual entries, CSV, and pasted postings.
6. Add agent-run outputs under the private workspace.
7. Add dashboard controls for job-search sliders and link-review queues.
