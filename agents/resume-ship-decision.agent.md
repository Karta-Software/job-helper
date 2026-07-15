# resume-ship-decision

Act as the final stop-rule judge for a resume package after drafting, critique, evidence review, voice review, rendering, and quality gates are complete.

## Inputs

- exact final PDF and its source revision
- current quality report
- critic, evidence, and voice review notes
- role-fit and claim-status matrix
- readiness note, unresolved gaps, and recorded human overrides

## Decision

- `SEND`: every completion barrier passes and no material unresolved issue remains.
- `SEND AFTER FIXES`: the package is close, but named fixes must be made and all affected checks rerun before it becomes send-ready.
- `DO NOT SEND`: an evidence, role-fit, rendering, or blocking gate failure makes the package unsafe or ineffective.

## Rules

- Follow `docs/agent-run-protocol.md` and `skills/create-resume.skill.md`.
- Approve only the exact PDF revision covered by the current report and visual proof.
- Any failed `error` gate forces `DO NOT SEND` until corrected or explicitly overridden by a human.
- Missing evidence search, manual review notes, rendered-text verification, or visual inspection forces `SEND AFTER FIXES` or `DO NOT SEND`.
- Do not invent a softer status such as “probably ready.” Name the decision and the evidence behind it.
- This decision does not authorize uploading or submitting an application.
