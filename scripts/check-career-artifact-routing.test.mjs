import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

test("top-level instructions automatically route the three artifact workflows", () => {
  const agents = read("AGENTS.md");

  for (const skill of ["create-resume", "create-cover-letter", "audit-role-skills"]) {
    assert.match(agents, new RegExp(`skills/${skill}\\.skill\\.md`));
  }

  assert.match(agents, /user does not need to invoke these skills by name/i);
  assert.match(agents, /Do not bypass the top-level completion barriers/i);

  assert.match(read("agents/resume-writer.agent.md"), /skills\/create-resume\.skill\.md/);
  assert.match(read("agents/resume-critic.agent.md"), /skills\/create-resume\.skill\.md/);
  assert.match(read("agents/resume-ship-decision.agent.md"), /skills\/create-resume\.skill\.md/);
  assert.match(read("agents/cover-letter-critic.agent.md"), /skills\/create-cover-letter\.skill\.md/);
  assert.match(read("agents/experience-finder.agent.md"), /skills\/audit-role-skills\.skill\.md/);
  assert.match(read("skills/tailor-resume.skill.md"), /skills\/create-resume\.skill\.md/);
  assert.match(read("skills/write-cover-letter.skill.md"), /skills\/create-cover-letter\.skill\.md/);
  assert.match(read("skills/discover-skills.skill.md"), /skills\/audit-role-skills\.skill\.md/);
});

test("resume creation cannot claim readiness without evidence, rendering, gates, and stop rule", () => {
  const skill = read("skills/create-resume.skill.md");

  for (const requiredRef of [
    "skills/find-experience.skill.md",
    "skills/tailor-resume.skill.md",
    "skills/audit-resume.skill.md",
    "skills/run-resume-quality-gates.skill.md",
    "skills/publish-resume.skill.md"
  ]) {
    assert.match(skill, textPattern(requiredRef));
  }

  assert.match(skill, /## Completion Barrier/);
  assert.match(skill, /final PDF was rendered and visually inspected/);
  assert.match(skill, /every configured `error` gate passed on that exact PDF revision/);
  assert.match(skill, /stop-rule judge approved the exact artifact/);
  assert.match(skill, /agents\/resume-ship-decision\.agent\.md/);
});

test("cover-letter creation enforces the canonical rubric threshold and error gates", () => {
  const skill = read("skills/create-cover-letter.skill.md");

  assert.match(skill, /skills\/write-cover-letter\.skill\.md/);
  assert.match(skill, /skills\/run-cover-letter-quality-gates\.skill\.md/);
  assert.match(skill, /85\/100 or higher plus all error gates passing/);
  assert.match(skill, /Do not silently replace it with 80, 90, or another threshold/);
  assert.match(skill, /company-swap test/);
  assert.match(skill, /adds useful information beyond the resume/);
  assert.match(skill, /final rendered PDF is one page/);
});

test("role skill Q/A requires stable IDs, complete export, and private graph writeback", () => {
  const skill = read("skills/audit-role-skills.skill.md");

  assert.match(skill, /`REQ-01`, `REQ-02`/);
  assert.match(skill, /`PREF-01`, `PREF-02`/);
  assert.match(skill, /`Copy all results` and `Download results`/);
  assert.match(skill, /# Role Skill Q\/A Submission - YYYY-MM-DD/);
  assert.match(skill, /Answer: <Yes \| Some \/ adjacent \| No \| Unsure \| Not asked - known>/);
  assert.match(skill, /Do not omit blank fields or unchanged known items/);
  assert.match(skill, /update the private Skill Inventory, role fit matrix, evidence backlog, and relevant experience notes/);
  assert.match(skill, /Do not add a skill to applicant-facing copy merely because the user clicked `Yes`/);
});

function read(filePath) {
  return fs.readFileSync(new URL(`../${filePath}`, import.meta.url), "utf8");
}

function textPattern(text) {
  return new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
}
