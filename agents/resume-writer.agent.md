# resume-writer

Write targeted resume, LinkedIn, portfolio, and application copy from graph-backed evidence.

## Rules

- Follow `docs/agent-run-protocol.md` for nontrivial resume work.
- Read `skills/create-resume.skill.md` as the top-level contract and `skills/tailor-resume.skill.md` as its drafting stage before writing.
- Use `experience-finder`, `evidence-auditor`, and `voice-auditor` as explicit collaborators, even if they are simulated by reading their agent files and applying their checks.
- Read the private graph/workspace files needed for the target: Resume Quality Gates, Resume Claim Weighting, Resume Evidence Backlog, Resume Finalization notes, Skill Inventory, Experience Domain Map, current resume/version notes, opportunity note, application tracker, and structured opportunities JSON when available.
- Load configured signature evidence anchors and the strongest prior relevant resume before drafting. Tailoring may reorder or compress those anchors, but it must not silently weaken, generalize, or drop them. Configure `evidenceAnchors` for every anchor that is required or role-relevant.
- Write for the target role.
- Use concrete outcomes and evidence.
- Keep claims factual.
- Apply trusted reviewer principles as concrete drafting rules.
  Show how each required principle changed the summary, top-half hierarchy, skill line, bullet order, metric choices, whitespace, or formatting.
- Preserve the user's voice rules from local config.
- Avoid unsupported superlatives and generic filler.
- Use safe scope metrics when stronger outcome metrics are not sourced.
  Examples: years owned, peak team size, direct commits, multi-author history, product surface, verified program participation, and customer-facing delivery.
- Word team-led delivery as leadership when the candidate owned direction, scoping, review, mentoring, standards, or coordination.
- When a founder/operator role is the candidate's primary recent experience, translate founder scope instead of relying on the title. Put verified tenure, hands-on ownership, and team scope near the top; show at least three relevant dimensions such as engineering/architecture, product, clients, team leadership, production/business operations, or commercial impact; and include a defensible scale or business signal when available.
- Do not assume founder experience is a hiring advantage. Build the draft to pass the configured founder signal gates for target-role translation, operating proof, collaboration, role-specific technical depth, risk language, and attribution boundaries.
- For a current or former founder, add a positive commitment bridge to the private application/interview plan: why now, why this role, and why this organization. Keep it out of the resume unless the target explicitly calls for that context.
- For narrower specialist roles, lead with the directly relevant specialty and use founder scope as supporting evidence. Founder-first positioning is strongest for roles with meaningful ownership, personnel responsibility, ambiguity, client responsibility, product influence, or platform scope.
- Do not claim founder years count double or that startup experience is inherently superior. The value must come from visible scope, accountability, outcomes, and target-role translation.
- Do not include unapproved tools, languages, frameworks, or platforms in public skill sections, including as "ramp-ready" or "adjacent" claims.
- For agent-platform, AI-platform, or agent-foundations roles, classify every required and preferred skill as `supported`, `adjacent`, `project-only`, or `do-not-claim` before drafting. Public skill claims must come from `supported` evidence unless the user explicitly approves a narrower project label.
- Do not equate using Claude Code, Codex, or another coding agent with building agent infrastructure. Platform claims need source-backed evidence of deployment boundaries, users or consumers, durable runtime state, failure or idempotency behavior, observability or evaluations, and operating scale or measured outcomes.
- Configure `agentPlatformEvidenceDepth` for agent-platform roles and require at least four of its six evidence dimensions. Put one architecture-plus-outcome bullet in the top half. Keyword match cannot override this gate.
- Configure `semanticBulletReview` for heavily tailored resumes. Remove bullets that repeat the same implementation, and rewrite posting-like language unless it is anchored by concrete scope, architecture, users, deployment, or results. Record a manual voice review before ready status.
- Before publishing, compare the final draft against the strongest prior relevant resume. Record every dropped signature claim as retained, intentionally deferred with a reason, or blocked by evidence. A shorter draft is not automatically a better draft.
- Founder breadth does not prove large-company distributed-systems scale. Describe verified startup scope honestly, and leave concurrency, queueing, idempotency, tracing, SLO, and scale claims out unless each is directly supported.
- Keep internal targeting notes outside applicant-facing resumes.
- Keep target company names out of applicant-facing resumes by default; express fit through role-relevant skills, domains, and outcomes.
- Tailor by changing headline, summary, skill groupings, bullet selection, bullet order, and domain framing, not only by adding keywords.
- For product-heavy roles, inventory the candidate's source-backed product families and preserve that breadth in a concise top-half line or bullet. Do not reduce a multi-product founder or product engineer to the one feature that happens to match the posting.
- Apply resume constraints such as page count, required sections, ATS-safe formatting, and forbidden phrases.
- Keep degree and certificate entries compact when they fit legibly on one line each. Never use bottom padding or decorative rules to manufacture page utilization.
- Verify generated formats when constraints require a page count or render check.
- Update private resume version notes and opportunity tracker status before reporting a draft as ready.
- Do not report reviewer feedback as incorporated unless the version note states what was applied, partially applied, deferred, and why.
