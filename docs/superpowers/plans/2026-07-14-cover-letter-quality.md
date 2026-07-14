# Cover Letter Quality Implementation Plan

**Goal:** Add a reusable, blocking cover-letter quality workflow and apply it to the current Samsara Agent Foundations letter.

**Architecture:** A pure evaluator in `src/cover-letters` consumes a target-specific JSON config and a measured letter snapshot. A CLI reads artifacts, measures text and PDF page count, invokes the evaluator, and writes a report. Skills and reviewer agents define how to draft, review, and rerun the workflow. Private configurations hold candidate evidence and manual notes.

**Runtime:** Node.js built-ins, the existing PDF page counter, JSON Schema, Markdown, and PowerShell for artifact verification.

### Task 1: Define failing evaluator tests

**Files:**
- Create: `scripts/check-cover-letter-quality.test.mjs`

1. Test score thresholds and `SEND`, `REVISE`, and `REWRITE` decisions.
2. Test that an error gate forces `DO NOT SEND` even with a high score.
3. Test required target terms, evidence anchors, two need-to-evidence bridges, company specificity, motivation review, resume complement, and voice review.
4. Test CLI page and word-count measurement.
5. Run the test and confirm it fails because the implementation is absent.

### Task 2: Implement the evaluator and CLI

**Files:**
- Create: `src/cover-letters/quality.mjs`
- Create: `scripts/check-cover-letter-quality.mjs`

1. Implement the smallest evaluator that satisfies the tests.
2. Use named gate results with severity, routing agent, and useful messages.
3. Sum configured rubric criteria and validate maximum scores.
4. Read rendered PDF page count when supplied.
5. Run the focused test suite until green.

### Task 3: Add the reusable contract and operating instructions

**Files:**
- Create: `schemas/cover-letter-quality-gates.schema.json`
- Create: `examples/cover-letter-quality-gates.example.json`
- Create: `skills/write-cover-letter.skill.md`
- Create: `skills/run-cover-letter-quality-gates.skill.md`
- Create: `agents/cover-letter-critic.agent.md`
- Modify: `agents/voice-auditor.agent.md`
- Modify: `docs/workflow.md`

1. Encode strict fake-data-only configuration in the schema and example.
2. Document drafting, independent criticism, manual review, and stop rules.
3. Add cover-letter-specific checks to the voice auditor.
4. Add the workflow and decision thresholds to the canonical workflow doc.
5. Validate JSON and run all repository tests.

### Task 4: Grade and revise the current private letter

**Files:**
- Create: private `cover-letter-quality-gates.before.json`
- Create: private `cover-letter-quality-report.before.json`
- Modify: private `cover-letter.md`, `cover-letter.html`, and `cover-letter.pdf`
- Create: private `cover-letter-quality-gates.json`
- Create: private `cover-letter-quality-report.json`
- Modify: private audit, readiness, and application-plan notes

1. Record the current 70-point `REWRITE` baseline with real reviewer notes.
2. Rewrite around why Samsara, why Agent Foundations, and why now.
3. Preserve sourced Windmill, AWS, AI Search, IoT, leadership, referral, and certificate evidence without turning the letter into resume prose.
4. Render the final PDF without headers or footers.
5. Run the checker, rendered-text checks, and visual inspection.
6. Copy only the verified final PDF to the ready and preview shelves.

### Task 5: Make the behavior durable

**Files:**
- Modify: private Career reviewer principles, quality-gate, opportunity, application, and current-resume notes
- Modify: Life daily note for 2026-07-14
- Create: Codex memory extension note

1. Record the permanent rubric and current package result in the Career graph.
2. Log the workflow change in the Life daily note.
3. Add a small memory extension instructing future agents to use the reusable checker and private target config.
4. Commit and push reusable Job Helper changes after verification.
