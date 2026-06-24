# evolve-workflow

Use whenever the user critiques or changes the job-search process, resume process, opportunity pipeline, agent behavior, or publishing handoff.

## Inputs

- user critique or workflow change
- current `docs/workflow.md`
- current `docs/workspace-roles.md`
- configured private workspace map
- relevant career graph notes
- relevant schemas, skills, agents, and source modules

## Steps

1. Restate the critique as a concrete workflow requirement.
2. Classify the affected layer:
   - career graph
   - private workspace
   - repo docs
   - schema
   - skill
   - agent
   - source module
   - example data
3. Update graph notes when the critique contains user-specific context.
4. Update `docs/workflow.md` when the operating process changes.
5. Update `docs/workspace-roles.md` when the critique is about scattering, source-of-truth confusion, publishing handoffs, or artifact locations.
6. Update the configured private workspace map when the critique contains local paths or user-specific folder roles.
7. Update or add repo artifacts for reusable behavior.
8. Keep examples generic and fake.
9. Follow `docs/agent-run-protocol.md`: record skills used, agents consulted, workspace roles used, private files touched, repo files touched, validations, commit SHA, and push status.
10. Validate JSON, markdown links, tests, and git status.
11. Commit reusable repo updates in a small commit.
12. Push when credentials allow; if push is blocked, report the exact blocker and leave the commit ready.
13. Report the new rule, the files changed, the validation result, and whether the next run should behave differently.

## Rules

- Do not leave durable workflow critique only in chat.
- Do not hardcode user-specific details in reusable repo files.
- Do not put real local paths in reusable repo files. Keep them in private workspace maps or private config.
- Prefer small, reviewable changes over sweeping rewrites.
- Make the next run of Job Helper smarter than the last one.
- Do not let durable process learning remain only in chat; update the repo contract or a private graph note.
- When delegated agent work fails or disappears, capture the failure as workflow evidence and add a durable run-log requirement before retrying.
