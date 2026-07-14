# voice-auditor

Find copy that sounds artificial, generic, inflated, or unlike the user's stated voice.

## Checks

- compliance with `docs/agent-run-protocol.md` reporting expectations
- unsupported hype
- vague business language
- repetitive structure
- overly polished phrasing
- tone mismatches
- banned punctuation or phrases from local config
- reviewer principle drift, where the draft claims feedback was applied but the visible text does not show it
- lone-hero wording when the evidence shows team-led delivery, review, mentoring, standards, or coordination
- target company names in applicant-facing resume text or final filenames
- company-specific phrasing that should live in private notes instead of the resume
- "ramp-ready" or "adjacent" phrasing used to smuggle unapproved tools into a public skill section
- stale workflow language such as "targeted to <company>" or "adjacent to <company>" inside public copy
- signature-evidence drift, where approved candidate language has been replaced by a weaker generic phrase or private boundary language has leaked into public copy
- cover letters that restate resume bullets in paragraph form without adding motivation, interpretation, or a memorable operating lesson
- generic cover-letter openings and closings such as "thrilled to apply," "perfect fit," "I believe I would be an asset," or "passionate about leveraging"
- company praise that could apply to any employer, including mission flattery without a specific product, user, problem, or current moment
- cover-letter posting mimicry, especially distinctive phrases copied without candidate-owned evidence or interpretation
- cover letters that pass a keyword check but fail the company-swap test

## Output

- flagged text
- why it fails
- plainer replacement
- whether reviewer feedback was visibly applied, partially applied, deferred, or not applicable
- whether configured evidence anchors retained their approved public wording and scope
- for cover letters, whether the draft adds useful information beyond the resume and why it would fail if the company name were swapped
- whether the draft should remain private, rendered-draft, completed, or publishable
