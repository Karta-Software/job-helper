# Job Finding Playbook

This playbook describes a reusable job-search process that does not depend on any one candidate. Store real candidate data, search results, resumes, and application notes in the private workspace, not in this repo.

## 1. Set Search Controls

Create a search profile before collecting jobs. The profile should capture explicit preferences and tradeoffs instead of relying on memory.

Useful controls:

- Work mode: onsite, hybrid, remote, field, or travel.
- Market: preferred cities/regions, excluded cities/regions, commute limits, and relocation stance.
- Compensation: minimum base, minimum total comp, desired total comp, commission tolerance, and whether the role must publish salary.
- Experience fit: candidate years, maximum acceptable required years, acceptable stretch gap, and whether to reject roles requiring many years in an unrelated domain.
- Role flexibility: title flexibility, domain flexibility, management load, technical depth, and travel tolerance.
- Dealbreakers: part-time, commission-only, unclear location, required credentials, or non-negotiable domain requirements.

Use `schemas/job-search-profile.schema.json` and `examples/demo-jobs/search-profile.json` as the shape.

## 2. Collect Jobs Broadly, Then Normalize

Sources can include:

- Employer career pages.
- Job boards and saved searches.
- Recruiter pages.
- Industry association boards.
- Pasted postings.
- CSV exports.
- Personal network leads.

Normalize every posting into the same core fields:

- company
- role
- location and work mode
- full-time/part-time/contract signal
- compensation range and notes
- experience requirements
- source URL
- imported timestamp
- posting description

Prefer employer-hosted links when possible. Job-board and aggregator links are useful for discovery, but should not be treated as final apply links until reviewed.

## 3. Vet Links Before Prioritizing

Every high-priority posting needs a link review:

- `live`: page loads and role matches the tracker.
- `broken`: page does not load.
- `unavailable` or `expired`: page loads but the role is gone.
- `confusing`: page loads but does not clearly show the listed job.
- `generic-search`: search results page instead of a specific role.
- `login-required` or `paywalled`: cannot verify without extra access.
- `duplicate`: same posting already tracked elsewhere.

When a link is broken or confusing, keep the role if it is still strategically interesting, but move it lower and mark that it needs a replacement direct link. Use `schemas/link-review.schema.json`.

## 4. Score Fit Separately From Interest

Do not confuse "interesting" with "good fit." Score roles against:

- role function alignment
- work mode and location fit
- compensation fit
- experience-years fit
- domain-years fit
- required credentials
- listed skills with evidence
- adjacent skills that can be framed carefully
- unlisted differentiators the candidate can safely mention
- broken/confusing link status

Recommended buckets:

- Strong: apply or tailor resume now.
- Possible: worth keeping, but needs careful positioning.
- Stretch: appealing, but one or more gaps may block the application.
- Blocked: dealbreaker, expired posting, or unsupported required credential.

## 5. Build Listed And Unlisted Skill Inventory

For each serious posting:

1. Extract skills explicitly listed in the posting.
2. Extract implied skills from responsibilities and outcomes.
3. Compare each skill to the candidate graph.
4. Mark each skill as direct, adjacent, unknown, or do-not-claim.
5. Attach evidence IDs or examples.
6. Convert unknowns into short candidate questions.
7. Identify safe unlisted differentiators that strengthen the application.

Use `schemas/skill-inventory.schema.json`.

## 6. Tailor Resumes With Constraints

Resume notes and applicant-facing resumes are different artifacts.

Applicant-facing resumes should not include:

- "Best target fit"
- "Use this version for..."
- "First-pass opportunities"
- internal ranking notes
- unsupported skills
- claim-policy labels

Keep that guidance in an index, application plan, or private notes file.

Useful resume constraints:

- maximum page count
- required sections
- ATS-safe formatting
- maximum bullets per role
- output formats
- forbidden applicant-facing phrases
- evidence requirement for claims
- render or PDF page-count checks

Use `schemas/resume-constraints.schema.json` and keep targeting guidance outside the resume.

## 7. Keep The Tracker Honest

After each review pass:

- Move broken/confusing links down.
- Archive expired or duplicate roles.
- Replace aggregator links with employer links.
- Update salary and experience notes.
- Update next action.
- Tie each application to the resume version used.
- Record why a role was passed or kept.

This keeps the search from becoming a stale list of attractive titles with unusable links.
