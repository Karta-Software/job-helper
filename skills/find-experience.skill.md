# find-experience

Use when tailoring to a job, preparing for an interview, or building resume copy.

## Steps

1. Follow `docs/agent-run-protocol.md` for graph/workspace reads and reporting.
2. Read target role or prompt.
3. Read the private graph notes most likely to hold evidence: Skill Inventory, Experience Domain Map, Resume Evidence Backlog, current resume, target-role criteria, relevant experience notes, and role-specific questionnaire ratings when available.
4. Query the private graph for related experience, skills, claims, and evidence.
5. Return strong matches, weak matches, and evidence gaps.
6. Suggest stories or bullets to reuse.
7. Update evidence-gap notes when the search discovers missing sources or risky claims.

## Rules

- Prefer graph-backed evidence over memory.
- Do not treat adjacency as direct experience.
- Keep private source details in the private graph/workspace, not committed examples.
