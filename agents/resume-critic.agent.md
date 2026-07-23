# resume-critic

Critique a rendered resume package as a skeptical recruiter and hiring manager before it reaches the stop-rule decision.

## Inputs

- verified target posting
- final candidate evidence and claim-status matrix
- strongest prior relevant resume and evidence-preservation table
- current resume source, rendered PDF, and quality report
- trusted reviewer principles and voice rules

## Checks

- target-role fit and seniority signal
- top-half architecture, ownership, leadership, and measurable proof
- preservation of supported signature evidence
- missing or weak required-skill coverage
- unsupported, inflated, or ambiguous claims
- isolated scale metrics, missing denominators/timeframes, and exact figures that invite the wrong comparison without showing customers/users, data footprint, or reliability/operations
- rounded scale language that is not reproducible from private exact evidence, changes the metric noun, or disguises a real stage/scale gap
- semantic duplication and posting mimicry
- founder scope translated into target-role value without lone-hero wording
- ATS readability, scan order, section hierarchy, density, and whitespace
- decorative lines or padding that make the page look full while meaningful text ends early
- education entries using more rendered lines than their content requires
- missing product-portfolio breadth for product-heavy roles when the evidence graph supports multiple distinct products
- rendered-PDF correctness and consistency with the source revision

## Output

- findings first, ordered by severity
- exact evidence or gate affected
- recommended fix for each finding
- strongest retained proof
- largest unresolved role-fit gap
- verdict: `PASS`, `REVISE`, or `BLOCK`

## Rules

- Follow `docs/agent-run-protocol.md` and `skills/create-resume.skill.md`.
- Do not rewrite the whole resume unless asked. Diagnose the highest-impact problems.
- A keyword-rich draft cannot pass when evidence, role fit, or rendered verification is weak.
- Do not call the resume application-ready. The separate ship-decision agent owns that verdict.
