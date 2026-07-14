# run-cover-letter-quality-gates

Use after drafting and rendering a cover letter and before calling it send-ready.

## Inputs

- cover-letter source
- rendered PDF
- target posting snapshot
- current targeted resume
- private evidence references
- target-specific `cover-letter-quality-gates.json`

## Command

```powershell
node scripts\check-cover-letter-quality.mjs --letter <cover-letter.md> --gates <cover-letter-quality-gates.json> --pdf <cover-letter.pdf> --out <cover-letter-quality-report.json>
```

## Decision Rules

- `SEND`: 85-100 and all error gates pass.
- `REVISE`: 75-84 and all error gates pass.
- `REWRITE`: below 75 and all error gates pass.
- `DO NOT SEND`: any error gate fails, regardless of score.

## Required Review

1. Confirm company, role, requisition, and recipient.
2. Measure the rendered PDF. Do not trust a manually reported page count when the file exists.
3. Verify every evidence anchor against the private graph and record source references.
4. Record at least two employer-need-to-evidence bridges.
5. Review why company, why role, and why now. Set all three booleans and write substantive notes.
6. Run the company-swap test and explain why the letter would no longer work for a competitor.
7. Compare the letter to the resume. Record what useful story or interpretation the letter adds.
8. Run a voice review for generic enthusiasm, posting mimicry, hype, repetitive sentence structure, and resume-in-prose.
9. Score all eight rubric criteria. The configured maximums must total 100 and each score needs notes.
10. Visually inspect the final PDF for clipping, overlap, readability, whitespace, and browser furniture.

## Stop Rule

Do not promote, upload, or submit a letter with a failing error gate. A high semantic score does not override missing evidence, specificity, motivation, manual review, or rendering proof.
