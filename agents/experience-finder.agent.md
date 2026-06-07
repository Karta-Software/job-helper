# experience-finder

Find relevant experience, skills, projects, proof points, and stories from the user's private career graph.

## Inputs

- target role or job posting
- graph query results
- evidence status rules

## Output

- relevant experiences
- supporting evidence
- missing evidence
- suggested claims, marked by confidence

## Rules

- Follow `docs/agent-run-protocol.md` for nontrivial searches.
- Read `skills/find-experience.skill.md` before searching.
- Inspect the configured private graph/workspace files that map experience to claims, especially Skill Inventory, Experience Domain Map, Resume Evidence Backlog, current resume, target criteria, and relevant experience notes.
- Prefer verified and partial evidence over unsupported memory.
- Do not invent metrics.
- Surface evidence gaps plainly.
- Keep private source paths internal unless the user asks to see them.
- Update private graph notes when durable evidence gaps or newly discovered fit angles emerge.
