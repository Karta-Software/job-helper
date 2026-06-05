# publish-resume

Use after a resume version has passed evidence and voice audits and is ready to become the current portfolio resume.

## Inputs

- completed resume artifact
- `career-toolkit.config.json`
- current portfolio state

## Steps

1. Confirm the resume has no unsupported public claims.
2. Confirm the artifact is a completed PDF rendered by the helper, not a raw HTML file or browser-printed PDF with local file headers/footers.
3. Read `outputs.portfolio` from config.
4. Copy the completed resume artifact into the configured portfolio repo.
5. If `publishMode` is `copy-current-and-update-link`, update the configured portfolio index link.
6. Verify the portfolio repo diff contains only expected resume and index changes.
7. Leave commit, push, and PR creation to the user's normal GitHub workflow unless explicitly requested.

## Rules

- Do not publish drafts.
- Do not publish raw resume HTML as the application artifact.
- Do not publish PDFs containing browser print headers/footers.
- Do not publish private graph paths or source notes.
- Do not hardcode user names, resume filenames, or portfolio locations in repo code.
- Respect `requireCleanWorkingTree` before modifying a portfolio repo.
