# Cover Letter Quality Design

## Purpose

A cover letter should make a hiring team understand why this candidate is useful for this exact employer problem now. It should complement the resume with motivation, interpretation, and a memorable proof story. It should not restate the resume in paragraphs.

## Decision Model

The evaluator combines blocking hard gates with a 100-point semantic rubric.

- `SEND`: score 85-100 and every error gate passes.
- `REVISE`: score 75-84 and every error gate passes.
- `REWRITE`: score below 75 and every error gate passes.
- `DO NOT SEND`: any error gate fails, regardless of score.

## Weighted Rubric

| Criterion | Points |
| --- | ---: |
| Correct target and audience | 10 |
| Why this company, role, and moment | 15 |
| Understanding of the employer's problem | 15 |
| Evidence connected to role needs | 20 |
| Narrative added beyond the resume | 15 |
| Authentic and memorable voice | 10 |
| Evidence accuracy and boundaries | 10 |
| Structure and rendering | 5 |

## Hard Gates

1. Correct company, role, requisition, and recipient.
2. One rendered page and a configured word range.
3. Public claims have supported evidence anchors and references.
4. At least two explicit employer-need-to-evidence bridges.
5. Direct and reviewed answers for why company, why role, and why now.
6. The company-swap test passes. The letter must break if the company name is swapped.
7. The letter adds a useful story or interpretation beyond the resume.
8. Generic enthusiasm, posting mimicry, resume-in-prose, and configured AI filler are absent.
9. A manual voice review records a pass and substantive notes.
10. A verified referral or relationship is used when useful and otherwise omitted.

## Workflow

The reusable Job Helper repository owns the evaluator, schema, agents, skills, example, and workflow documentation. Private candidate workspaces own target-specific configurations, evidence references, scores, review notes, and generated artifacts.

Manual review is intentional. Motivation, company specificity, and voice cannot be proved by keyword checks alone. Mechanical checks support the reviewer but never replace the recorded judgment.
