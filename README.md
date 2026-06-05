# Job Helper

Job Helper is a local-first career toolkit for turning a private career knowledge graph into job-search materials, interview prep, and application decisions.

The repo contains reusable code, schemas, agent templates, skills, starter decks, and fake demo data. Your real career graph, resumes, applications, and generated outputs stay outside the repo in a private workspace.

## Core Ideas

- Keep private career data out of source control.
- Use a knowledge graph to connect experience, skills, claims, evidence, jobs, and interview prep.
- Track resume versions instead of overwriting one resume forever.
- Track jobs separately from resume drafts.
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
```

## Private Workspace

Create a private workspace outside git or in a gitignored `.career-toolkit/` folder:

```text
.career-toolkit/
  career-toolkit.config.json
  agents/local-overrides/
  skills/local-overrides/
  resumes/versions/
  jobs/tracker.json
  jobs/postings/
  jobs/finder-runs/
  study/progress.json
  study/generated-cards.json
  outputs/
```

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
