# audit-role-skills

Use when a target role has required or preferred skills that are not yet classified, when the user asks what experience they do or do not have, or when resume/cover-letter work would otherwise guess at role fit. Invoke this skill automatically before public drafting when material requirements remain unclassified.

## Purpose

Turn a job description into a complete, non-leading, copy-pasteable skill and experience questionnaire. Use the answers to improve the private evidence graph and claim boundaries before writing applicant-facing materials.

## Inputs

- verified posting or saved posting snapshot
- role title, company, requisition, URL, and capture date
- current private Skill Inventory
- Experience Domain Map and evidence backlog
- relevant experience, resume, and prior role-intake notes
- configured private output workspace

## Required Workflow

1. Follow `docs/agent-run-protocol.md` and load the configured private workspace map.
2. Extract every distinct required and preferred qualification, responsibility, domain, tool, duration, scale, credential, work-condition, and leadership expectation from the posting.
3. Split compound requirements into atomic questions when one answer could differ from another. Preserve the original posting text and map each atomic item back to it.
4. Assign stable IDs within the role snapshot: `REQ-01`, `REQ-02`, and so on for required items; `PREF-01`, `PREF-02`, and so on for preferred items.
5. Compare each item against the private graph and classify it as:
   - `confirmed`: direct experience with adequate evidence already recorded
   - `partial-adjacent`: related experience exists, but the exact requirement is not established
   - `unconfirmed`: the graph does not answer it
   - `do-not-claim`: evidence or a prior answer says not to claim it
6. Do not re-ask a `confirmed` or `do-not-claim` item unless evidence is stale, contradictory, too broad for the posting, or the user explicitly asks for a full audit. Show already-known classifications in a collapsed review section so the user can correct drift.
7. Run `skills/discover-skills.skill.md` for the unanswered items, using the role requirement as the source rather than a generic technology list.
8. Create a standalone HTML questionnaire in the configured private agent-managed workspace. It must work from `file://` without a server and include:
   - role and posting identity
   - progress counts for answered and remaining items
   - filters for required, preferred, unanswered, and known items
   - one stable-ID section per atomic requirement
   - original posting text and a short plain-language explanation
   - neutral choices: `Yes`, `Some / adjacent`, `No`, and `Unsure`
   - optional fields for where used, what the user did, duration/recency, scale, outcome, collaborators, and evidence locations
   - a user-selectable confidence field: `High`, `Medium`, `Low`, or blank
   - local draft persistence
   - `Copy all results` and `Download results` controls
9. The copied result must contain the entire intake, not only changed answers. Use this deterministic Markdown shape and preserve the field names exactly:

   ```markdown
   # Role Skill Q/A Submission - YYYY-MM-DD

   Role: <title>
   Company: <company>
   Requisition: <requisition or unknown>
   URL: <posting URL>
   Captured: <posting capture timestamp>
   Exported: <result export timestamp>

   ## REQ-01 - Required
   Requirement: <exact atomic requirement>
   Source text: <original posting text>
   Prior classification: <confirmed | partial-adjacent | unconfirmed | do-not-claim>
   Answer: <Yes | Some / adjacent | No | Unsure | Not asked - known>
   Confidence: <High | Medium | Low | blank>
   Where used: <text>
   What I did: <text>
   Duration / recency: <text>
   Scale: <text>
   Outcome: <text>
   Collaborators: <text>
   Evidence locations: <text>
   Notes: <text>
   ```

   Repeat the block in stable ID order for every item. Known items use `Answer: Not asked - known` unless the user changes them. Do not omit blank fields or unchanged known items.
10. When the user pastes the result back, parse every ID, preserve their wording, and update the private Skill Inventory, role fit matrix, evidence backlog, and relevant experience notes.
11. Translate answers to claim status:
   - `Yes` with direct evidence: candidate for `supported`
   - `Yes` without evidence details: `self-confirmed`, with an evidence gap before strong public use
   - `Some / adjacent`: `adjacent`, including the user's reason
   - `No`: `do-not-claim`
   - `Unsure`: `unconfirmed`, with a targeted follow-up or evidence search
12. Re-run the target-role matrix after graph updates. Resume and cover-letter workflows may use only the resulting claim status, not the questionnaire button label alone.

## Question Design Rules

- Do not ask, “You have X, right?” or embed the preferred answer in the question.
- Do not collapse years, scale, production use, leadership, and tool familiarity into one yes/no answer.
- Distinguish hands-on use, team leadership, project-only exposure, production operation, and adjacent experience.
- Explain unfamiliar terms without teaching the user how to answer yes.
- Include required work conditions such as location, travel, authorization, clearance, or on-call expectations, but keep protected demographic questions out of this intake.
- Never convert a negative answer into positive resume language.

## Completion Barrier

Do not call the role skill audit complete unless:

- every required and preferred posting item has a stable ID and source mapping
- every item has a graph classification or an answer prompt
- the HTML opens locally and its controls work
- `Copy all results` exports the complete deterministic payload
- pasted answers, when provided, are written back to the private graph and role matrix
- unresolved items remain explicit rather than being guessed during resume or cover-letter drafting

## Rules

- Store candidate answers and evidence only in the private graph/workspace.
- Commit only generic workflow instructions and fake examples.
- Do not add a skill to applicant-facing copy merely because the user clicked `Yes`.
- Preserve prior answers unless the user changes them or better evidence resolves a conflict.
- Report the questionnaire path, item counts by classification, private notes updated, and remaining evidence gaps.
