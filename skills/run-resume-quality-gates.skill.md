# run-resume-quality-gates

Use after rendering a resume draft and before moving it to completed resumes.

## Inputs

- rendered resume text or HTML
- rendered PDF or final artifact path
- target posting text or extracted keywords
- `outputs.resumeQualityGates`
- resume standards
- claim evidence map

## Gates

- page count
- page utilization / bottom whitespace
- word count
- character count including spaces
- rendered text-line count
- bullet character count
- achievement bullet count
- required sections
- keyword match against the posting
- unsupported technology or experience terms
- skill/tool claims not approved by the configured skill inventory
- missing AI-native development signal for technical roles when configured as required
- target company name leakage in applicant-facing text or artifact filenames
- private/internal note leakage
- browser print header/footer leakage

## Steps

1. Follow `docs/agent-run-protocol.md` and include quality-gate results in the run log/report.
2. Measure the rendered resume.
   Page count must come from the rendered PDF or final artifact, not from a manual assertion.
   Page utilization must come from rendered HTML layout measurement, not eyeballing.
   For one-page resumes, bottom whitespace should roughly match the page margins, usually around 3% to 3.5% of printable content height.
   Rendered text-line count must be measured from the final artifact or reported as unmeasured; do not substitute source Markdown line count.
3. Compare measurements to configured gates.
   Disclose any required sections inferred from header structure rather than explicit section headings.
4. Compare resume keywords against the posting keywords and label whether the comparison used configured required keywords, supplied posting keywords, or extracted posting keywords.
5. Fail the run when any `error` gate fails.
6. Check `approvedSkillClaims` when the role has skill/tool keywords and a skill inventory is available.
   This is a positive inventory gate: denylist checks are not enough.
7. Check `targetBranding` when the target company is known.
   Target company names belong in private strategy artifacts by default, not in the public resume text or final filename.
8. Notify each gate's `reworkAgent` and cite the matching agent file in the report.
9. Re-run `tailor-resume` until the gates pass or `agentRouting.maxIterations` is reached.
10. Update the private resume note/tracker with pass/fail status and the next rework action.
11. If the resume still fails, keep it in rendered drafts and ask for a human decision.
12. Move to completed resumes only after gates pass or a human override is recorded.

## Agent Routing

- `resume-writer`: length, layout, sections, bullet density.
- `posting-scorer`: keyword mismatch and posting alignment.
- `experience-finder`: missing achievement bullets or weak evidence coverage.
- `evidence-auditor`: unsupported claims or risky metrics.
- `evidence-auditor`: unsupported technology terms, such as skills that are not backed by the graph.
- `voice-auditor`: private notes, AI-sounding text, hype, and tone.

## Rules

- Treat quality gates like CI checks.
- Never pass page-count gates by trusting a user or agent-provided page number when a rendered PDF exists.
- Never treat a browser-printed PDF with local file URL/date/page-number headers or footers as a completed resume.
- Do not pass one-page resumes that leave excessive bottom whitespace; route underfilled pages to `resume-writer`. A one-page resume with bottom whitespace much larger than the side and top margins is underfilled even when the page-utilization percentage passes a loose gate.
- Manual page or rendered-line counts require an explicit human override flag and must be called out in the report.
- Bullet character gates apply to achievement bullets, not compact skill-list bullets.
- Hard bullet limits and ideal bullet ranges are separate: hard failures can block; ideal misses should notify the resume writer as warnings.
- Treat unsupported technology terms as a denylist guardrail, not a complete evidence audit. The evidence audit still needs graph-backed claim review.
- Treat approved-skill failures as evidence-auditor failures: remove the skill claim or update the private skill inventory only after the user confirms the skill.
- Treat target-branding failures as voice/positioning failures: remove the company name and express the same fit through role-relevant capabilities, domains, and outcomes.
- If an AI-native development signal is configured as required for a technical role, route omissions to `resume-writer` and unsupported AI claims to `evidence-auditor`.
- Prefer contrast from typographic hierarchy: section anchors, leading, role-block rules, bold proof points, and bullet rhythm.
- Avoid visual contrast that hurts parsing: tables, text boxes, icons, skill bars, or decorative graphics.
- Do not publish or submit a resume with failing `error` gates.
- Warnings can pass but must be included in the audit report.
- Do not hide failures by deleting useful evidence; rework the resume.
- Record overrides explicitly in the private resume version notes.
