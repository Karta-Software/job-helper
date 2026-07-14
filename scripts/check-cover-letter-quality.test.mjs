import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  decisionFromScore,
  evaluateCoverLetterQuality
} from "../src/cover-letters/quality.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const checkerPath = path.join(repoRoot, "scripts", "check-cover-letter-quality.mjs");

test("score thresholds produce send, revise, and rewrite decisions", () => {
  assert.equal(decisionFromScore(85, true, { send: 85, revise: 75 }), "SEND");
  assert.equal(decisionFromScore(84, true, { send: 85, revise: 75 }), "REVISE");
  assert.equal(decisionFromScore(74, true, { send: 85, revise: 75 }), "REWRITE");
});

test("an error gate blocks sending regardless of score", () => {
  assert.equal(decisionFromScore(100, false, { send: 85, revise: 75 }), "DO NOT SEND");

  const config = passingConfig();
  config.gates.voiceReview.manualReviewStatus = "fail";
  config.gates.voiceReview.manualReviewNotes = "The closing still sounds generic.";

  const report = evaluateCoverLetterQuality(config, passingSnapshot());

  assert.equal(report.score, 100);
  assert.equal(report.passed, false);
  assert.equal(report.decision, "DO NOT SEND");
  assert.equal(result(report, "voiceReview").passed, false);
});

test("missing required gates or rubric criteria block sending", () => {
  const config = passingConfig();
  delete config.gates.motivationReview;
  config.rubric.criteria = config.rubric.criteria.filter((criterion) => criterion.id !== "voice");

  const report = evaluateCoverLetterQuality(config, passingSnapshot());

  assert.equal(result(report, "configCompleteness").passed, false);
  assert.match(result(report, "configCompleteness").message, /motivationReview/);
  assert.match(result(report, "configCompleteness").message, /voice/);
  assert.equal(report.decision, "DO NOT SEND");
});

test("a specific, sourced, manually reviewed letter can be send-ready", () => {
  const report = evaluateCoverLetterQuality(passingConfig(), passingSnapshot());

  assert.equal(report.score, 100);
  assert.equal(report.maximumScore, 100);
  assert.equal(report.passed, true);
  assert.equal(report.decision, "SEND");
  assert.equal(report.results.every((gate) => gate.passed), true);
});

test("evidence anchors require supported status, source refs, and public wording", () => {
  const config = passingConfig();
  config.gates.evidenceAnchors.anchors[0].evidenceRefs = [];

  const report = evaluateCoverLetterQuality(config, passingSnapshot());

  assert.equal(result(report, "evidenceAnchors.platform-proof").passed, false);
  assert.match(result(report, "evidenceAnchors.platform-proof").message, /evidence reference/i);
  assert.equal(report.decision, "DO NOT SEND");
});

test("at least two employer-need-to-evidence bridges must be present", () => {
  const config = passingConfig();
  config.gates.needEvidenceBridges.minimum = 2;
  config.gates.needEvidenceBridges.bridges[1].evidenceTerms = ["missing production proof"];

  const report = evaluateCoverLetterQuality(config, passingSnapshot());

  assert.equal(result(report, "needEvidenceBridges").passed, false);
  assert.match(result(report, "needEvidenceBridges").message, /1 of 2/);
});

test("manual motivation, company-swap, complement, and voice notes are mandatory", () => {
  const config = passingConfig();
  config.gates.motivationReview.manualReviewNotes = "";
  config.gates.companySpecificity.companySwapNotes = "";
  config.gates.resumeComplement.manualReviewStatus = "pending";
  config.gates.voiceReview.manualReviewNotes = "";

  const report = evaluateCoverLetterQuality(config, passingSnapshot());

  assert.equal(result(report, "motivationReview").passed, false);
  assert.equal(result(report, "companySpecificity").passed, false);
  assert.equal(result(report, "resumeComplement").passed, false);
  assert.equal(result(report, "voiceReview").passed, false);
});

test("forbidden generic phrases block an otherwise strong letter", () => {
  const snapshot = passingSnapshot();
  snapshot.text += " I am thrilled to apply and believe I would be an asset.";
  snapshot.wordCount += 12;

  const report = evaluateCoverLetterQuality(passingConfig(), snapshot);

  assert.equal(result(report, "forbiddenPhrases").passed, false);
  assert.match(result(report, "forbiddenPhrases").message, /thrilled to apply/i);
});

test("CLI measures letter text and a rendered one-page PDF", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "cover-letter-quality-"));
  try {
    const letterPath = path.join(directory, "letter.md");
    const configPath = path.join(directory, "gates.json");
    const pdfPath = path.join(directory, "letter.pdf");
    const outputPath = path.join(directory, "report.json");
    fs.writeFileSync(letterPath, passingSnapshot().text);
    fs.writeFileSync(configPath, JSON.stringify(passingConfig(), null, 2));
    fs.writeFileSync(pdfPath, minimalPdf(1));

    const run = spawnSync(process.execPath, [
      checkerPath,
      "--letter", letterPath,
      "--gates", configPath,
      "--pdf", pdfPath,
      "--out", outputPath
    ], { encoding: "utf8" });

    assert.equal(run.status, 0, run.stderr || run.stdout);
    const report = JSON.parse(fs.readFileSync(outputPath, "utf8"));
    assert.equal(report.measurements.pageCount, 1);
    assert.equal(report.measurements.pageCountSource, "pdf");
    assert.equal(report.measurements.wordCount > 0, true);
    assert.equal(report.decision, "SEND");
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

function passingSnapshot() {
  const text = [
    "Acme Systems Senior Platform Engineer REQ-42 Hiring Team.",
    "Acme protects field technicians, and this is the right moment to make long-running workflows recoverable.",
    "The role needs durable workflow state and reliable recovery for internal engineering teams.",
    "I built a PostgreSQL-backed task ledger with duplicate protection and recovery after repeated automation failures.",
    "The role also needs production ownership at meaningful scale.",
    "I operated an AWS service that handled 20 million measured requests while improving deployment quality.",
    "I am moving from founder ownership into a team where I can apply that operating judgment with deeper platform peers.",
    "A former colleague referred me after seeing this work directly.",
    "The difficult lesson was that retry logic alone does not create durable execution. Ownership, state, and review boundaries do.",
    "I would welcome a discussion about making Acme's workflow platform dependable for its engineers and field customers."
  ].join(" ");
  return {
    text,
    wordCount: text.match(/\b[\w'+-]+\b/g).length,
    pageCount: 1,
    pageCountSource: "pdf"
  };
}

function passingConfig() {
  return {
    version: 1,
    thresholds: { send: 85, revise: 75 },
    gates: {
      wordCount: { minimum: 80, maximum: 450, severity: "error", reworkAgent: "cover-letter-critic" },
      pages: { maximum: 1, severity: "error", reworkAgent: "cover-letter-critic" },
      targetIdentity: {
        requiredTerms: ["Acme Systems", "Senior Platform Engineer", "REQ-42", "Hiring Team"],
        severity: "error",
        reworkAgent: "cover-letter-critic"
      },
      evidenceAnchors: {
        minimum: 2,
        anchors: [
          {
            id: "platform-proof",
            requiredTerms: ["PostgreSQL-backed task ledger", "duplicate protection", "recovery"],
            evidenceStatus: "supported",
            evidenceRefs: ["fake/evidence/platform.md"]
          },
          {
            id: "production-proof",
            requiredTerms: ["AWS", "20 million", "deployment quality"],
            evidenceStatus: "supported",
            evidenceRefs: ["fake/evidence/production.md"]
          }
        ],
        severity: "error",
        reworkAgent: "evidence-auditor"
      },
      needEvidenceBridges: {
        minimum: 2,
        bridges: [
          {
            id: "durable-workflows",
            needTerms: ["durable workflow state", "reliable recovery"],
            evidenceTerms: ["PostgreSQL-backed task ledger", "duplicate protection"],
            evidenceRefs: ["fake/evidence/platform.md"]
          },
          {
            id: "production-scale",
            needTerms: ["production ownership", "meaningful scale"],
            evidenceTerms: ["AWS", "20 million measured requests"],
            evidenceRefs: ["fake/evidence/production.md"]
          }
        ],
        severity: "error",
        reworkAgent: "cover-letter-critic"
      },
      companySpecificity: {
        requiredFacts: [
          { id: "mission", terms: ["field technicians"] },
          { id: "platform-problem", terms: ["long-running workflows", "internal engineering teams"] }
        ],
        minimumFacts: 2,
        companySwapStatus: "pass",
        companySwapNotes: "The field-technician mission and internal workflow problem are specific to Acme's posting.",
        severity: "error",
        reworkAgent: "cover-letter-critic"
      },
      motivationReview: {
        whyCompany: true,
        whyRole: true,
        whyNow: true,
        manualReviewStatus: "pass",
        manualReviewNotes: "The letter states the mission, platform problem, and founder-to-platform transition directly.",
        severity: "error",
        reworkAgent: "cover-letter-critic"
      },
      resumeComplement: {
        manualReviewStatus: "pass",
        manualReviewNotes: "The retry lesson and current career transition add interpretation rather than repeating bullets.",
        severity: "error",
        reworkAgent: "cover-letter-critic"
      },
      voiceReview: {
        manualReviewStatus: "pass",
        manualReviewNotes: "Direct language, no hype, no lone-hero framing, and no posting mimicry.",
        severity: "error",
        reworkAgent: "voice-auditor"
      },
      referral: {
        enabled: true,
        requiredTerms: ["former colleague referred me"],
        evidenceStatus: "supported",
        evidenceRefs: ["fake/evidence/referral.md"],
        severity: "error",
        reworkAgent: "cover-letter-critic"
      },
      forbiddenPhrases: {
        terms: ["thrilled to apply", "perfect fit", "believe I would be an asset", "passionate about leveraging"],
        severity: "error",
        reworkAgent: "voice-auditor"
      }
    },
    rubric: {
      manualReviewStatus: "pass",
      manualReviewNotes: "Independent review completed against the letter and posting.",
      criteria: [
        criterion("targetAudience", "Correct target and audience", 10, 10),
        criterion("whyCompanyRoleNow", "Why this company, role, and moment", 15, 15),
        criterion("employerProblem", "Understanding of the employer's problem", 15, 15),
        criterion("evidenceConnection", "Evidence connected to role needs", 20, 20),
        criterion("resumeComplement", "Narrative added beyond the resume", 15, 15),
        criterion("voice", "Authentic and memorable voice", 10, 10),
        criterion("evidenceAccuracy", "Evidence accuracy and boundaries", 10, 10),
        criterion("structure", "Structure and rendering", 5, 5)
      ]
    }
  };
}

function criterion(id, label, maximum, score) {
  return { id, label, maximum, score, notes: `${label} reviewed against the target.` };
}

function result(report, gateId) {
  return report.results.find((gate) => gate.gateId === gateId);
}

function minimalPdf(pageCount) {
  const kids = Array.from({ length: pageCount }, (_, index) => `${index + 3} 0 R`).join(" ");
  const pages = Array.from({ length: pageCount }, (_, index) => `${index + 3} 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>
endobj`).join("\n");
  return `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Count ${pageCount} /Kids [${kids}] >>
endobj
${pages}
trailer
<< /Root 1 0 R >>
%%EOF`;
}
