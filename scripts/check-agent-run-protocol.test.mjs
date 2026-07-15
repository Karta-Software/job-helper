import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const requiredProtocolRefs = [
  "skills/create-resume.skill.md",
  "skills/tailor-resume.skill.md",
  "skills/run-resume-quality-gates.skill.md",
  "skills/create-cover-letter.skill.md",
  "skills/audit-role-skills.skill.md",
  "agents/resume-writer.agent.md",
  "agents/evidence-auditor.agent.md",
  "agents/voice-auditor.agent.md"
];

const requiredPrivateContext = [
  "Resume Quality Gates",
  "Resume Claim Weighting",
  "Resume Evidence Backlog",
  "Resume Finalization",
  "Skill Inventory",
  "Experience Domain Map",
  "opportunities JSON"
];

test("agent run protocol names the required resume workflow contracts", () => {
  const protocol = read("docs/agent-run-protocol.md");

  for (const ref of requiredProtocolRefs) {
    assert.match(protocol, textPattern(ref), `Expected protocol to reference ${ref}`);
  }

  for (const contextName of requiredPrivateContext) {
    assert.match(protocol, textPattern(contextName), `Expected protocol to require ${contextName}`);
  }
});

test("top-level instructions require the agent run protocol", () => {
  const agents = read("AGENTS.md");

  assert.match(agents, /docs\/agent-run-protocol\.md/);
  assert.match(agents, /Push when credentials allow/);
  assert.match(agents, /Resume Quality Gates/);
  assert.match(agents, /Experience Domain Map/);
});

test("core skills and agents stay wired to the agent run protocol", () => {
  const files = [
    "skills/evolve-workflow.skill.md",
    "skills/create-resume.skill.md",
    "skills/create-cover-letter.skill.md",
    "skills/audit-role-skills.skill.md",
    "skills/tailor-resume.skill.md",
    "skills/run-resume-quality-gates.skill.md",
    "skills/find-experience.skill.md",
    "skills/track-opportunity.skill.md",
    "skills/audit-resume.skill.md",
    "agents/resume-writer.agent.md",
    "agents/evidence-auditor.agent.md",
    "agents/voice-auditor.agent.md",
    "agents/experience-finder.agent.md"
  ];

  for (const file of files) {
    assert.match(read(file), /docs\/agent-run-protocol\.md/, `Expected ${file} to reference the protocol`);
  }
});

test("protocol makes delegated work durable", () => {
  const protocol = read("docs/agent-run-protocol.md");
  const evolveWorkflow = read("skills/evolve-workflow.skill.md");

  assert.match(protocol, /subagent work should create or update this run record before doing long-running edits/);
  assert.match(protocol, /outputs\/agent-runs\/<YYYY-MM-DD>-<slug>\.json/);
  assert.match(evolveWorkflow, /delegated agent work fails or disappears/);
});

function read(filePath) {
  return fs.readFileSync(new URL(`../${filePath}`, import.meta.url), "utf8");
}

function textPattern(text) {
  return new RegExp(escapeRegExp(text));
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
