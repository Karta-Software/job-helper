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

## Agent Run Protocol

For any nontrivial run, follow `docs/agent-run-protocol.md`.

Before drafting, scoring, tracking, or publishing, load the relevant skill file from `skills/` and the relevant role agent files from `agents/`. Treat those files as operating contracts, not background reading.

When the run touches resume or application work, read and update the configured private career graph/workspace files needed for the task, including private equivalents of Resume Quality Gates, Resume Claim Weighting, Resume Evidence Backlog, Resume Finalization notes, Skill Inventory, Experience Domain Map, current resume/version notes, opportunity notes, application tracker, and structured opportunities JSON when available.

When the run discovers reusable workflow learning, update the repo and make a small commit. Push when credentials allow. If push is blocked, leave the commit ready and report the blocker.

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
- Agent underutilization: update `docs/agent-run-protocol.md`, `skills/evolve-workflow.skill.md`, the affected task skill, and the affected `agents/*.agent.md` files.
