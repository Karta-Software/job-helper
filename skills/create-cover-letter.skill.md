# create-cover-letter

Use whenever the user asks to create, write, rebuild, revise, target, or finalize a cover letter. Invoke this skill automatically. The user does not need to name it.

## Purpose

Produce a source-backed, company-specific application argument in the candidate's voice. A cover letter is not send-ready until the rubric and every blocking gate pass on the rendered artifact.

## Required Workflow

1. Follow `docs/agent-run-protocol.md` and load the configured private workspace map.
2. Verify or save the posting, company, role, requisition, recipient, and relevant company research from primary sources.
3. Load the exact targeted resume, candidate evidence and claim boundaries, current transition context, verified referral context, and voice rules.
4. If a role requirement used in the planned argument is unclassified, run `skills/audit-role-skills.skill.md` before drafting.
5. Run `skills/write-cover-letter.skill.md`. Record why this company, why this role, why now, the employer's two most important problems, two evidence bridges, and the useful story or interpretation the letter adds beyond the resume.
6. Draft in the candidate's demonstrated voice. When the user provides speech-to-text or a writing sample, preserve its strongest wording and sentence rhythm while cleaning transcription errors and incomplete thoughts.
7. Review independently with:
   - `agents/cover-letter-critic.agent.md`
   - `agents/evidence-auditor.agent.md`
   - `agents/voice-auditor.agent.md`
8. Run the company-swap test, resume-complement review, motivation review, posting-mimicry review, and evidence verification. Record substantive manual notes rather than setting pass flags without review.
9. Save the source, target-specific rubric configuration, review notes, evidence references, rendered HTML/PDF, quality report, and readiness note in the configured private application package.
10. Render one page without browser headers or footers and visually inspect the final PDF for clipping, overlap, readability, whitespace, and correct recipient details.
11. Run `skills/run-cover-letter-quality-gates.skill.md` against the final PDF. Revise and rerun until the score is at least 85 and all `error` gates pass, or the iteration limit is reached.
12. Update the private opportunity and application notes. Never upload or submit without a separate explicit user instruction.

## Required Package

- verified posting and company source notes
- exact targeted resume reference
- why-company, why-role, and why-now notes
- at least two employer-need-to-evidence bridges
- canonical cover-letter source
- rendered HTML and one-page PDF
- target-specific rubric/gates configuration
- critic, evidence, voice, company-swap, and resume-complement reviews
- final quality report and visual verification
- readiness note naming remaining gaps and overrides

## Completion Barrier

Do not use `send-ready`, `application-ready`, `final`, `approved`, or equivalent language unless all of the following are true:

- the exact company, role, requisition, and recipient were checked
- every public claim has an allowed evidence status and source reference
- why company, why role, and why now have substantive manual review notes
- at least two employer-need-to-evidence bridges are recorded
- the company-swap test fails for a documented, company-specific reason
- the letter adds useful information beyond the resume
- critic, evidence, and voice reviews passed
- the final rendered PDF is one page and passed visual inspection
- the rubric score is at least 85 out of 100
- every configured `error` gate passed on that exact PDF revision

If any item is missing, label the package `draft` or `not send-ready` and name the exact blocker. Good grammar, a high score with a failed gate, urgency, or a strong resume cannot override this barrier.

Use the canonical decision threshold exactly: `85/100 or higher plus all error gates passing`. Do not silently replace it with 80, 90, or another threshold. A target-specific configuration may raise the threshold only when it records the deliberate override and reason.

## Rules

- Do not turn the resume into paragraphs.
- Do not invent motivation, referrals, scale, outcomes, or familiarity with the employer.
- Do not use generic company praise as specificity.
- Preserve human voice. Remove generic AI career-coach phrasing, posting mimicry, hype, repetitive sentence structure, and overly polished language that the candidate would not say.
- Keep the employer name in the cover letter, but out of the applicant-facing resume by default.
- Report the exact skill files, reviewer stances, private files, rubric score, gate status, artifact path, and remaining gaps.
