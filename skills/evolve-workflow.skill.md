# evolve-workflow

Use whenever the user critiques or changes the job-search process, resume process, opportunity pipeline, agent behavior, or publishing handoff.

## Inputs

- user critique or workflow change
- current `docs/workflow.md`
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
5. Update or add repo artifacts for reusable behavior.
6. Keep examples generic and fake.
7. Follow `docs/agent-run-protocol.md`: record skills used, agents consulted, private files touched, repo files touched, validations, commit SHA, and push status.
8. Validate JSON, markdown links, tests, and git status.
9. Commit reusable repo updates in a small commit.
10. Push when credentials allow; if push is blocked, report the exact blocker and leave the commit ready.
11. Report the new rule, the files changed, the validation result, and whether the next run should behave differently.

## Rules

- Do not leave durable workflow critique only in chat.
- Do not hardcode user-specific details in reusable repo files.
- Prefer small, reviewable changes over sweeping rewrites.
- Make the next run of Job Helper smarter than the last one.
- Do not let durable process learning remain only in chat; update the repo contract or a private graph note.
- When delegated agent work fails or disappears, capture the failure as workflow evidence and add a durable run-log requirement before retrying.
