# Job Helper Agent Instructions

Job Helper is a critique-driven career toolkit. When the user critiques the job-search workflow, resume workflow, opportunity tracker, agent behavior, schemas, or output format, treat that critique as product feedback and improve the repo unless the user is clearly only brainstorming.

## Core Loop

1. Capture the user's critique in plain language.
2. Decide which layer it affects:
   - graph knowledge and personal context
   - reusable Job Helper workflow
   - schema or typed contract
   - agent prompt or skill
   - private workspace output
   - portfolio publishing handoff
3. Update the private career graph first when the critique contains user-specific context.
4. Generalize reusable behavior into this repo without hardcoding the user's name, graph path, target role, relationships, or portfolio location.
5. Update `docs/workflow.md` whenever the process itself changes.
6. Add or revise skills, agents, schemas, examples, or source types when the critique reveals a missing capability.
7. Validate JSON, markdown links, and git status before reporting back.

## Boundaries

- Do not commit private career data, application notes, generated resumes, relationship details, or graph contents.
- Keep user-specific paths and preferences in private config or the private workspace.
- Examples must use fake data.
- The repo should improve with every concrete workflow critique.

## Common Critique Targets

- Opportunity tracking: update `skills/track-opportunity.skill.md`, `schemas/opportunity.schema.json`, `src/jobs/tracker.ts`, and `docs/workflow.md`.
- Resume standards: update `skills/research-resume-standards.skill.md`, `schemas/resume-standards.schema.json`, `src/resumes/standards.ts`, and `docs/workflow.md`.
- Resume drafting: update `skills/tailor-resume.skill.md`, resume schemas, and renderer contracts.
- Publishing: update `skills/publish-resume.skill.md`, `src/resumes/publish.ts`, and config examples.
- Agent behavior: update the relevant `agents/*.agent.md` file and add a skill if the behavior is a repeatable workflow.
