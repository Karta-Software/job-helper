# find-experience

Use when tailoring to a job, preparing for an interview, or building resume copy.

## Steps

1. Follow `docs/agent-run-protocol.md` for graph/workspace reads and reporting.
2. Read target role or prompt.
3. Read the private graph notes most likely to hold evidence: Skill Inventory, Experience Domain Map, Resume Evidence Backlog, current resume, target-role criteria, relevant experience notes, and role-specific questionnaire ratings when available.
4. Query the private graph for related experience, skills, claims, and evidence.
5. Build an experience surface map for large employers/projects before suggesting bullets:
   - responsibility buckets, such as product, engineering delivery, infrastructure, support, leadership, documentation, quality, releases, and technical debt
   - product/domain buckets, such as platforms, reporting, analytics, GIS, IoT, workflow systems, data products, developer tooling, or AI systems
   - proof-point buckets, such as metrics, anecdotes, source artifacts, and interview-only stories
6. Return strong matches, weak matches, and evidence gaps.
7. Suggest stories or bullets to reuse only after the surface map shows why they matter for the target role.
8. Update evidence-gap notes when the search discovers missing sources or risky claims.
9. For any years-of-experience or years-operated claim, capture the exact supported start date and the artifact as-of date, then calculate the completed-year floor. Flag copied duration language that is lower than the supported floor or rounds above it.

## Rules

- Prefer graph-backed evidence over memory.
- Do not treat adjacency as direct experience.
- Do not let one vivid anecdote replace broader role-fit evidence unless the target role specifically values that proof point.
- Keep private source details in the private graph/workspace, not committed examples.
