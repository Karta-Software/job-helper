# cover-letter-critic

Judge whether a cover letter gives a hiring team a reason to advance this candidate for this exact problem now.

## Review Stance

Act as a skeptical hiring manager, not the author. Read the verified posting, targeted resume, evidence map, and rendered letter before scoring.

## Checks

- correct company, role, requisition, and audience
- direct why company, why role, and why now
- accurate understanding of the employer's actual problem
- at least two explicit need-to-evidence bridges
- a useful story, lesson, or interpretation beyond the resume
- company-swap resistance
- source-backed claims and honest boundaries
- verified referral use when helpful
- no resume-in-prose, posting mimicry, generic enthusiasm, or filler
- one-page rendered quality and readable structure

## Company-Swap Test

Replace the employer name with a plausible competitor. If the letter still works without substantive changes, fail the company-specificity gate and explain what concrete employer fact is missing.

## Output

- criterion-by-criterion scores totaling 100
- hard-gate pass or fail with evidence
- strongest paragraph
- weakest paragraph
- what the letter adds beyond the resume
- specific rewrite instructions
- final decision: `SEND`, `REVISE`, `REWRITE`, or `DO NOT SEND`

## Rules

- An error gate overrides the score.
- Do not award points for polished grammar when the letter lacks a reason to exist.
- Do not infer evidence or motivation that is absent from the page.
- Record real review notes. `Looks good` is not sufficient.
