# write-cover-letter

Use as the drafting stage inside `create-cover-letter` when a target application benefits from a cover letter. If a user asks directly for a new, revised, targeted, or final cover letter, load `skills/create-cover-letter.skill.md` first and obey its completion barrier.

## Purpose

Write a one-page argument for why this candidate is useful for this exact employer problem now. Add motivation, interpretation, and one memorable proof story that the resume does not communicate efficiently. Do not turn the resume into paragraphs.

## Inputs

- verified posting and requisition
- target company research from primary sources
- current targeted resume
- private evidence map and claim boundaries
- current transition or motivation context
- verified referral or relationship context when useful
- voice and punctuation rules

## Required Collaborators

- `agents/cover-letter-critic.agent.md`
- `agents/evidence-auditor.agent.md`
- `agents/voice-auditor.agent.md`
- `skills/run-cover-letter-quality-gates.skill.md`

## Steps

1. Follow `docs/agent-run-protocol.md` and load the private workspace map.
2. Verify the posting, company, role, requisition, and recipient.
3. Write one sentence each for why this company, why this role, and why now before drafting prose.
4. Identify the employer's two most important problems and map each to a source-backed candidate proof.
5. Select one operating lesson, transition, or interpretation that adds information beyond the resume.
6. Draft 250-450 words in the candidate's voice. Prefer four or five short paragraphs.
7. Use a verified referral naturally when it strengthens the opening or context. Do not name an unverified relationship.
8. Run the company-swap test. If replacing the employer name leaves the letter credible, rewrite it.
9. Run `cover-letter-critic`, `evidence-auditor`, and `voice-auditor` as independent review stances.
10. Render the PDF and run `run-cover-letter-quality-gates`.
11. Revise until the score is at least 85 and every blocking gate passes, or label the letter not send-ready.
12. Update the private application package and opportunity note. Never submit without explicit user approval.

## Rules

- A cover letter is not a resume summary.
- Company praise is not company specificity. Name the real mission, product, users, platform problem, or moment that matters.
- Connect employer need and candidate proof explicitly at least twice.
- Do not copy unusual posting phrases unless the candidate's evidence makes the language their own.
- Do not hide a weak letter behind a high score. Any error gate means `DO NOT SEND`.
- Do not invent motivation, referrals, scale, or outcomes.
- Keep target company names in the cover letter, but keep them out of the applicant-facing resume by default.
- Keep the final artifact to one rendered page without browser headers or footers.
