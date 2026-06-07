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
- target company names in applicant-facing resume text or final filenames
- company-specific phrasing that should live in private notes instead of the resume
- stale workflow language such as "targeted to <company>" or "adjacent to <company>" inside public copy

## Output

- flagged text
- why it fails
- plainer replacement
- whether the draft should remain private, rendered-draft, completed, or publishable
