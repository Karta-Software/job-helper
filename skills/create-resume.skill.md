# create-resume

Use whenever the user asks to create, write, rebuild, revise, target, or finalize a resume. Invoke this skill automatically. The user does not need to name it.

## Purpose

Produce a source-backed resume package, not chat-only copy. A resume is not application-ready until the rendered artifact passes the configured quality gates and the stop-rule review.

## Required Workflow

1. Follow `docs/agent-run-protocol.md` and load the configured private workspace map.
2. Verify or save the target posting. If no exact posting exists, record the target-role assumptions.
3. Load candidate identity, application defaults, current resume, strongest relevant prior resume, reviewer principles, claim weighting, evidence backlog, Skill Inventory, Experience Domain Map, and target opportunity notes.
4. Run `skills/find-experience.skill.md` before drafting. Use `agents/experience-finder.agent.md` or the configured resume-data-finder stance to trace claims to evidence and identify gaps.
5. If any required or preferred role requirement is unclassified, run `skills/audit-role-skills.skill.md` before turning it into public copy.
6. Run `skills/build-skill-inventory.skill.md` or load a current role-specific inventory. Classify every posting requirement as `supported`, `adjacent`, `project-only`, or `do-not-claim`, with evidence references.
7. Run `skills/rank-claim-significance.skill.md` when supported claims compete for limited space.
8. If production scale, customer adoption, data volume, traffic, or reliability is a material hiring bar, build or refresh a private production scale surface before drafting. Record exact measurements, definitions, capture dates, evidence references, and honest boundaries. Choose conservative public rounding that remains reproducible from the private evidence, and configure `productionScaleNarrative` for the target version.
9. Run `skills/tailor-resume.skill.md` to build the target-specific structure, evidence-preservation table, and draft.
10. Review the draft using these independent stances:
   - `agents/resume-writer.agent.md`
   - `agents/resume-critic.agent.md`
   - `agents/evidence-auditor.agent.md`
   - `agents/voice-auditor.agent.md`
11. Run `skills/audit-resume.skill.md` and resolve unsupported claims, omitted signature evidence, reviewer-principle failures, posting mimicry, semantic duplication, lone-hero language, isolated scale metrics, and weak top-half proof.
12. Save the complete version package in the configured private resume-version workspace. Include the posting snapshot, claim-status matrix, evidence references, source resume, rendered HTML, target-specific gates, quality report, review notes, readiness note, and visual proof.
13. Render the PDF without browser headers or footers. Verify the final PDF text and page image from the same source revision. Measure the last meaningful text independently from decorative rules or container padding, and measure rendered education lines when education is present.
14. Run `skills/run-resume-quality-gates.skill.md` against the rendered PDF. Rework and rerun until all `error` gates pass or the iteration limit is reached.
15. Run `agents/resume-ship-decision.agent.md` as the final stop-rule judge. It may approve only the exact PDF covered by the current passing report.
16. Run `skills/publish-resume.skill.md` only after the version is approved. Update the private resume index, opportunity note, application tracker, and run record.

## Required Package

- posting snapshot or recorded target-role assumptions
- required/preferred skill and claim-status matrix with evidence references
- evidence-preservation and reviewer-principle tables
- canonical resume source
- rendered HTML and PDF
- target-specific quality-gates configuration
- quality report from the final PDF revision
- critic, evidence, voice, and stop-rule notes
- current rendered-text and visual verification
- readiness note naming remaining gaps and overrides

## Completion Barrier

Do not use `application-ready`, `send-ready`, `final`, `approved`, or equivalent language unless all of the following are true:

- the evidence search ran before drafting
- all public claims have an allowed evidence status
- required manual reviewer notes are recorded
- the final PDF was rendered and visually inspected
- decorative rules, padding, or empty education rows do not create false page-utilization proof
- rendered-text verification passed
- every configured `error` gate passed on that exact PDF revision
- the stop-rule judge approved the exact artifact

If any item is missing, label the package `draft` or `not application-ready` and name the exact blocker. Keyword match, one-page layout, user urgency, or a polished source file cannot override this barrier.

## Rules

- Preserve supported signature evidence unless the version note records why it was retargeted or deferred.
- Tailor structure and proof selection, not just keywords.
- Keep target-company names out of applicant-facing resume text and filenames unless a human override says otherwise.
- Do not infer skills, scale, dates, degree labels, or metrics from old resume wording.
- Rounded public scale language must be derived from exact private evidence, preserve its timeframe and definition, and never cross an unsupported threshold. `Registered accounts` cannot silently become `active users`; stored objects cannot become customer assets; a target 5XX response rate cannot become uptime or availability.
- Keep company outcomes and team-led work distinct from lone-person attribution.
- Do not promote or submit an artifact. Submission always requires a separate explicit user instruction.
- Report the exact skill files, agent stances, private files, validation commands, gate status, final artifact path, and remaining gaps.
