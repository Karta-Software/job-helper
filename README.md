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

## Repo Layout

```text
apps/study/              interview and study page
apps/dashboard/          future graph, resume, jobs, and agents UI
agents/                 reusable agent personalities
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

## What This Is Not

This is not an auto-apply tool. It helps find, rank, prepare, and track opportunities. The user still applies manually.

## First Build Targets

1. Move study cards out of the HTML and into JSON.
2. Store study progress in the private workspace.
3. Add a graph adapter for Obsidian and plain JSON.
4. Generate and track resume versions.
5. Import and score jobs from manual entries, CSV, and pasted postings.
6. Add agent-run outputs under the private workspace.
