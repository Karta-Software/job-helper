# Workspace Roles

Job Helper should run inside a small set of named workspace roles instead of scattering artifacts across arbitrary folders.

## Required Roles

| Role | Purpose | May contain private data? | Commit to public repo? |
| --- | --- | --- | --- |
| Career graph | Human-readable candidate truth: experience, evidence, applications, resume strategy, interview prep | Yes | No |
| Private workspace | Generated drafts, rendered resumes, trackers, run logs, source captures, local config | Yes | No |
| Job Helper repo | Reusable engine: skills, agents, schemas, scripts, docs, fake examples | No | Yes |
| Portfolio repo | Approved public portfolio/resume artifacts | Public-only | Yes |
| Drill workspace | Interview drill app, practice deck, exported practice submissions | Usually private | No by default |
| Human-facing shelf | Ready-to-use PDFs, quick actions, shortcuts, final handoff files | Yes, but curated | No |

## Routing Rules

- The career graph is the source of truth for candidate facts and evidence.
- The private workspace stores generated operational outputs. It is not the source of truth for claims.
- The Job Helper repo must stay identity-agnostic. Use config and private workspace roles for real paths.
- The portfolio repo receives only approved public artifacts.
- The drill workspace owns practice mechanics, not resume truth.
- The human-facing shelf is for convenience copies and shortcuts, not a second knowledge graph.
- If a run does not know the workspace role for a file, it should stop and record a workspace-map gap instead of inventing a new location.

## Agent Requirement

Before a resume, application, or publishing run, agents should load the configured workspace map and report which roles they used:

- graph files read or changed
- private workspace outputs read or written
- repo files changed
- portfolio files changed
- human-facing shelf files produced

This makes path use auditable and prevents hidden artifact spread.
