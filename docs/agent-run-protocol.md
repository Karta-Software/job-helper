# Agent Run Protocol

This protocol makes Job Helper's agents and skills operational instead of decorative. Use it for every nontrivial job-search, resume, interview-prep, opportunity, or workflow-evolution run.

## Required Run Loop

1. Load `AGENTS.md`.
2. Load `docs/workflow.md`.
3. Load `docs/workspace-roles.md`.
4. Load the configured private workspace map for the current candidate or deployment.
5. Load the primary skill for the task and any directly referenced skills.
6. Load the role agent files that should participate in the work.
7. Load the configured private career graph and workspace files needed for the task.
8. Run the task.
9. Update private graph/workspace files when the run learns durable candidate, opportunity, evidence, or workflow context.
10. Update repo docs, skills, agents, schemas, examples, or source modules when the run reveals reusable product behavior.
11. Validate the changed private files and repo files.
12. For rendered artifacts, verify the final artifact itself, not only the source file used to produce it.
13. Commit reusable repo changes frequently in small commits.
14. Push reusable repo changes when credentials allow; when push is blocked, record the blocker and leave the local commit ready.
15. Report the skills used, agents consulted, workspace roles used, private files touched, repo files touched, commands run, quality-gate status, rendered-artifact verification, commit SHA, and push status.

## Required Private Context

The exact file paths come from local config. For resume and application work, the run should usually inspect or update the private equivalents of:

- Resume Quality Gates.
- Resume Claim Weighting.
- Resume Evidence Backlog.
- Resume Finalization notes.
- Skill Inventory and role-specific skill questionnaires.
- Experience Domain Map.
- Candidate identity and application defaults such as name, preferred contact facts, education wording, and application form preferences.
- Current Resume and relevant resume version notes.
- Opportunity note, application tracker, and structured opportunities JSON.
- Relevant experience and evidence notes.

If a file is expected but missing, record that as a graph/workspace gap instead of silently proceeding.

## Workspace Role Discipline

Every run should classify files by workspace role before reading or writing them:

- career graph
- private workspace
- Job Helper repo
- portfolio repo
- drill workspace
- human-facing shelf
- agent-managed support shelf

Do not create new storage roots just because a task is ambiguous. If the configured map does not say where an artifact belongs, record a workspace-map gap and ask for or infer the smallest safe update to the private map.

When a file is in an agent-managed support shelf, do not make the user sort through that shelf. Retrieve the exact file, promote approved artifacts to the human-facing shelf or portfolio handoff, archive stale material under the configured legacy area, and report the exact path used.

When using shells where native command failures do not automatically stop execution, check the native exit code before copying, promoting, or reporting artifacts. A stale output copied after a failed render is a workflow failure even if later source-file checks pass.

## Skill And Agent Utilization

Skills are workflow contracts. Agents are judgment roles. A run should not merely mention them after the fact; it should use them to structure the work.

Canonical resume workflow files:

- `skills/tailor-resume.skill.md`
- `skills/find-experience.skill.md`
- `skills/build-skill-inventory.skill.md`
- `skills/rank-claim-significance.skill.md`
- `skills/audit-resume.skill.md`
- `skills/run-resume-quality-gates.skill.md`
- `skills/publish-resume.skill.md`
- `agents/resume-writer.agent.md`
- `agents/experience-finder.agent.md`
- `agents/evidence-auditor.agent.md`
- `agents/voice-auditor.agent.md`

Canonical workflow-critique file:

- `skills/evolve-workflow.skill.md`

For resume tailoring:

- Use `tailor-resume` as the top-level workflow.
- Use `find-experience` before drafting.
- Use `build-skill-inventory` or a saved inventory before deciding keywords and adjacent claims.
- Use `rank-claim-significance` when too many true claims compete for one-page space.
- Use `audit-resume`, `evidence-auditor`, and `voice-auditor` before treating copy as send-ready.
- Use `run-resume-quality-gates` on the rendered artifact.
- Use `publish-resume` only after completion approval.

For opportunity work:

- Use `track-opportunity` for pipeline updates.
- Use `vet-job-links` before ranking postings.
- Use `synthesize-role-proxy` when there is no exact posted role.
- Use `rank-jobs` after dealbreakers and link confidence are known.

For workflow critique:

- Use `evolve-workflow`.
- Update `docs/workflow.md` when the operating model changes.
- Update the affected skills and agents so the next run behaves differently.
- Add or revise tests when the behavior can be checked mechanically.

## Run Log Shape

When a workflow produces durable output, write or update an agent-run record in the private workspace when feasible. Use `schemas/agent-run.schema.json` for the reusable shape.

Delegated or subagent work should create or update this run record before doing long-running edits. If the parent thread loses the subagent handle, the private run record must still show what was attempted, what files were touched, and what remains blocked.

Default private run-log location:

```text
<private-workspace>/outputs/agent-runs/<YYYY-MM-DD>-<slug>.json
```

Use a stable slug that describes the reusable task, not a private target company unless the file is staying in the private workspace.

Minimum fields:

- `id`
- `agent`
- `skillsUsed`
- `agentsConsulted`
- `privateFilesRead`
- `privateFilesChanged`
- `repoFilesChanged`
- `validationCommands`
- `qualityGates`
- `workflowFindings`
- `commit`
- `push`
- `supportFilesTouched`
- `renderedArtifactVerification`

The run log must not include private source text that belongs only in the career graph.

## Commit And Push Discipline

Commit reusable repo improvements whenever a coherent workflow improvement lands. Prefer small commits named after the generalized behavior, not the private application.

Good:

- `Add agent run protocol`
- `Require company-neutral resume artifacts`
- `Document adjacency rationale workflow`

Avoid:

- `Update Jonny resume`
- `Samsara fixes`
- `Private career graph updates`

Never commit private graph contents, generated resumes, relationship details, real application notes, or local paths unless they are fake example data.
