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
- private/internal note leakage
- browser print header/footer leakage

## Steps

1. Measure the rendered resume.
   Page count must come from the rendered PDF or final artifact, not from a manual assertion.
   Page utilization must come from rendered HTML layout measurement, not eyeballing.
   Rendered text-line count must be measured from the final artifact or reported as unmeasured; do not substitute source Markdown line count.
2. Compare measurements to configured gates.
   Disclose any required sections inferred from header structure rather than explicit section headings.
3. Compare resume keywords against the posting keywords and label whether the comparison used configured required keywords, supplied posting keywords, or extracted posting keywords.
4. Fail the run when any `error` gate fails.
5. Notify each gate's `reworkAgent`.
6. Re-run `tailor-resume` until the gates pass or `agentRouting.maxIterations` is reached.
7. If the resume still fails, keep it in rendered drafts and ask for a human decision.
8. Move to completed resumes only after gates pass or a human override is recorded.

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
- Do not pass one-page resumes that leave excessive bottom whitespace; route underfilled pages to `resume-writer`.
- Manual page or rendered-line counts require an explicit human override flag and must be called out in the report.
- Bullet character gates apply to achievement bullets, not compact skill-list bullets.
- Hard bullet limits and ideal bullet ranges are separate: hard failures can block; ideal misses should notify the resume writer as warnings.
- Treat unsupported technology terms as a denylist guardrail, not a complete evidence audit. The evidence audit still needs graph-backed claim review.
- Prefer contrast from typographic hierarchy: section anchors, leading, role-block rules, bold proof points, and bullet rhythm.
- Avoid visual contrast that hurts parsing: tables, text boxes, icons, skill bars, or decorative graphics.
- Do not publish or submit a resume with failing `error` gates.
- Warnings can pass but must be included in the audit report.
- Do not hide failures by deleting useful evidence; rework the resume.
- Record overrides explicitly in the private resume version notes.
